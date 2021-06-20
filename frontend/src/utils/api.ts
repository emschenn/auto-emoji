export const postData = (url, data) => {
  // Default options are marked with *
  return fetch(url, {
    body: JSON.stringify(data), // must match 'Content-Type' header
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    headers: {
      "Access-Control-Allow-Origin": "*",
      "content-type": "application/json",
    },
    method: "POST", // *GET, POST, PUT, DELETE, etc.
  }).then((response) => response.json()); // 輸出成 json
};
