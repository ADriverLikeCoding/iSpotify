var skip_next_data;

const interjectState = async function interceptorState(response) {
    // 处理state
    if (getURLLastPart(response.url) == 'state') {
        const jsonData = await response.clone().json();
        
        if (typeof jsonData.state_machine !== 'undefined') {
            const state_machine = jsonData.state_machine;
            const updated_state_ref = jsonData.updated_state_ref;
            const updatedStateIndex = updated_state_ref.state_index;
            const states = state_machine.states;
            const currentState = states[updated_state_ref.state_index];
            const skip_next = currentState.transitions.skip_next;
            const tracks = state_machine.tracks;
            
            // eable player all controller
            jsonData.state_machine.states[updatedStateIndex].restrictions = {};
            
            // 控制随机播放的顺序
            jsonData.state_machine.attributes.options.shuffling_context = false;
            
            // eable seek 必须restrictions里没有seek
            jsonData.state_machine.states[updatedStateIndex].disallow_seeking = false;
            
            // 实现无限skip next
            if (skip_next === null) {
                console.log("replaced skip_next data");
                jsonData.state_machine.states[updatedStateIndex].transitions.skip_next = skip_next_data;
            } else {
                skip_next_data = skip_next;
            }
            
            // 去除广告
            for (track of tracks) {
                if (track.content_type == 'AD') {
                    const adIndex = tracks.indexOf(track); // 找到广告在track中的位置
                    const music = tracks.find((track) => track.content_type != 'AD'); // 找到track中第一个不是广告的track
                    jsonData.state_machine.tracks[adIndex] = music; // 将广告替换为第一个不是广告的track
                    console.log('skipped ad');
                }
            }
            // 替换skip_prev为skip_next，实现previous button点击后也能skip
            jsonData.state_machine.states[updatedStateIndex].transitions.skip_prev = skip_next_data;
        }
        
        const json = () => response.clone().json().then((data) => (jsonData));
        response.json = json;
        return response;
    }
    
    return response;
};

interceptorsResponse.push(interjectState);
