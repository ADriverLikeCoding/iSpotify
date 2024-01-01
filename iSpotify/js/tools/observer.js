var documentChildListObserver = [];

// Select the node that will be observed for mutations
const targetNode = document

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };

// Callback function to execute when mutations are observed
const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
        if (mutation.type === "childList") {
            // console.log("A child node has been added or removed.");
            for (let node of mutation.addedNodes) {
                documentChildListObserver.forEach( observe => {
                    observe(node);
                });
            }
        }
    }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);
