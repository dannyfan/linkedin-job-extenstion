
function convertTimeTextToValue(text) {
    let value = 0;
    const daysValue = {
        'day' : 1,
        'week' : 7,
        'month' : 30
    }
    const textArr = text.trim().split(' ');
    if (textArr.length > 2) {
        value = parseInt(textArr[0]) + daysValue[textArr[1].replace('s', '')];
    }
    return value;
}

function findParent(node, parentTagName) {
    let parentNode = node.parentNode;
    if (parentNode.tagName.toLowerCase() !== parentTagName.toLowerCase()) {
        return findParent(parentNode, parentTagName);
    }
    return parentNode;
}

function hideMessageBar() {
    const messageBar = document.querySelector('.msg-overlay-list-bubble');
    if (messageBar) {
        messageBar.style.display = 'none';
    }
}

function hidePremiumAd() {
    const premiumAd = document.querySelector('.gp-promo-embedded-card-2__card');
    if (premiumAd) {
        const premiumContainer = findParent(premiumAd, 'li');
        premiumContainer.style.display = 'none';
    }
}

function sortJobsByTime() {
    const jobList = document.querySelector('ul.jobs-jymbii__list');
    const jobPosts = document.querySelectorAll('li.job-card');
    const jobPostsArr = Array.prototype.slice.call(jobPosts);
    
    jobPostsArr.sort(function(a, b) {
        let valueA = convertTimeTextToValue(a.querySelector('.job-card__listed-status > *').textContent);
        let valueB = convertTimeTextToValue(b.querySelector('.job-card__listed-status > *').textContent);
        if (valueA > valueB) return 1;
        if (valueA < valueB) return -1;
        return 0;
    });

    for (let i = 0; i < jobPostsArr.length; i++) {
        jobList.appendChild(jobPostsArr[i]);
    }
}

function openLinksNewTab() {
    const jobLinks = document.querySelector('a.job-card__link-wrapper');
    if (jobLinks) {
        jobLinks.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const link = this.getAttribute('href');
            window.open(link, '_blank');
        });
    }
}

function showFullJobDescription() {
    const button = document.querySelector('button[data-control-name="see_more"]');
    const jobDescription = document.querySelector('.jobs-description--is-truncated');
    console.log(button);
    console.log(jobDescription);
    if (button && jobDescription) {
        console.log('click');
        button.click();
    }
}

function createSortButton() {
    const container = document.querySelector('.ph5.pb0.pt2');
    if (container) {
        const button = document.createElement('button');
        const buttonText = document.createTextNode('Sort Jobs (Newest - Oldest)');
        button.appendChild(buttonText);
        button.classList.add('artdeco-button');
        button.addEventListener('click', function() {
            sortJobsByTime();
        });
        container.appendChild(button);
    }
}

(function() {
    const config = {
        childList: true,
        subtree: true
    }

    const observer = new MutationObserver(function(mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                if (mutation.target.classList.contains('msg-overlay-list-bubble')) {
                    hideMessageBar();
                }
                if (mutation.target.classList.contains('gp-promo-embedded-card-2__card')) {
                    hidePremiumAd();
                }
                // if (mutation.target.classList.contains('application-outlet') && !clicked) {
                //     console.log('job description here');
                //     showFullJobDescription();
                //     clicked = true;
                // }
            }
        }
    });

    observer.observe(document, config);
    createSortButton();
    openLinksNewTab();

    window.onload = function() {
        showFullJobDescription();
    }
})();