const sendReq = function(method, url, callback, content) {
  const xhr = new XMLHttpRequest();
  xhr.onload = function() {
    if (this.status === 200) {
      callback && callback(this.response);
    }
  };
  xhr.responseType = 'json';
  xhr.open(method, url);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(content);
};

const sendGetReq = function(url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.onload = function() {
    callback(this);
  };
  xhr.onerror = function(err) {
    const { log } = console;
    log(err);
  };
  xhr.open('GET', url);
  xhr.send();
};
