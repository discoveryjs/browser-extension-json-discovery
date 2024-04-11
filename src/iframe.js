const iframe = document.createElement('iframe');

iframe.src = chrome.runtime.getURL('sandbox.html');
iframe.classList.add('__discovery__');
iframe.style.cssText = 'position: fixed;inset: 0;border: 0; width:100%; height: 100%;';

document.body.appendChild(iframe);

