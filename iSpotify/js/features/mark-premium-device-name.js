function markComputerPageDeviceName(resource, options) {
    if (getURLLastPart(resource) == 'devices') {
        const json = JSON.parse(options.body);
        const deviceID = json.device.device_id;
        json.device.name = "Premium"; // computer page device name is premium
        options.body = JSON.stringify(json);
    }
    
    return options;
}

interceptorRequest.push(markComputerPageDeviceName);
