var isEnableTrackRowSuccess = false;

function enableTrackRow() {

    function base64ToBytes(base64) {
        const binString = atob(base64);
        return Uint8Array.from(binString, (m)=>m.codePointAt(0));
    }

    function bytesToBase64(bytes) {
        const binString = String.fromCodePoint(...bytes);
        return btoa(binString);
    }

    const initialStateElement = document.getElementById('initial-state');

    // 解码base64的initial state
    const initialStateBase64 = initialStateElement.textContent;
    const initialState = new TextDecoder().decode(base64ToBytes(initialStateBase64));
    const json = JSON.parse(initialState);
    const session = json.session;
    const product = session.product;

    // 修改为premium的状态
    product.ads = '0';
    product.catalogue = 'premium'
    product.product = 'premium';
    product['on-demand'] = '1';
    product['is-standalone-audiobooks'] = '1';
    json.session.product = product;

    // 重新编码为base64的initial state
    const newInitialState = JSON.stringify(json);
    const newInitialStateBase64 = bytesToBase64(new TextEncoder().encode(newInitialState));

    initialStateElement.textContent = newInitialStateBase64;
    isEnableTrackRowSuccess = true;
    console.log('enable track row success');
}

const observeInitState = node => {
    if (node.id == 'initial-state' && !isEnableTrackRowSuccess) {
        console.log('find initial-state');
        enableTrackRow();
    }
}

documentChildListObserver.push(observeInitState);
