var isOpenOnMobileScucess = false;
function enableOpenInMoblie() {
    const featuresElement = document.getElementById('features');
    if (featuresElement === null || featuresElement == 'undefined') {
        console.log('can not find features')
    }else {
        var features = JSON.parse(featuresElement.textContent);
        features.mwp = true;
        const newFeatures = JSON.stringify(features);
        featuresElement.textContent = newFeatures;
        isOpenOnMobileScucess = true;
        console.log('enable open in moblie success');
    }
}

const observeFeatures = node => {
    if (node.id == 'features' && !isOpenOnMobileScucess) {
        console.log('find features');
        enableOpenInMoblie();
    }
}

documentChildListObserver.push(observeFeatures);
