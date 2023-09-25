
'use strict'

const request = require('request');

let Service, Characteristic

module.exports = (homebridge) => {
  Service = homebridge.hap.Service
  Characteristic = homebridge.hap.Characteristic
  homebridge.registerAccessory('homebridge-http-dimmer', 'HTTP-DIMMER', DimmerAccessory)
}

class DimmerAccessory {
  constructor (log, config) {
    this.log = log
    this.config = config
    this.brightness = 0
    this.statusUrl = config.statusUrl
    this.onUrl = config.onUrl
    this.offUrl = config.offUrl
    this.setBrightnessUrl = config.setBrightnessUrl
    this.getBrightnessUrl = config.getBrightnessUrl
    this.service = new Service.Lightbulb(this.config.name)
  }

  getServices () {
    const informationService = new Service.AccessoryInformation()
        .setCharacteristic(Characteristic.Manufacturer, 'illiteratewriter')
        .setCharacteristic(Characteristic.Model, 'http-dimmer')
        .setCharacteristic(Characteristic.SerialNumber, 'home-http-dimmer')

    this.service.getCharacteristic(Characteristic.On)
      .on('get', this.getOnCharacteristicHandler.bind(this))
      .on('set', this.setOnCharacteristicHandler.bind(this))

    this.service.getCharacteristic(Characteristic.Brightness)
      .on('get', this.getBrightness.bind(this))
      .on('set', this.setBrightness.bind(this));

    return [informationService, this.service]
  }

  getBrightness (callback) {
    request(`${this.getBrightnessUrl}`, (err, resp, body) => {
      if(err){
        this.log(err)
      }
      callback(null, parseInt(body))
    })
  }

  setBrightness (value, callback) {
    this.brightness = value
    this.log('Setting brightness:', value)
    request(`${this.setBrightnessUrl}${value}`, (err, resp, body) => {
      callback(null, value)
    })
  }

  setOnCharacteristicHandler (value, callback) {
    this.isOn = value
    if(value === true){
      request(this.onUrl, (err, resp, body) => {
        callback(null)
      })
    } else {
      request(this.offUrl, (err, resp, body) => {
        callback(null)
      })
    }
  }

  getOnCharacteristicHandler (callback) {
    request(`${this.statusUrl}`, (err, resp, body) => {
      if(body == 0){
        this.isOn = false
      } else {
        this.isOn = true
      }
      callback(null, this.isOn)
    })
  }
}
