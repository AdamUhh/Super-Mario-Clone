
export function loadImage(url) {
  return new Promise((resolve) => {
    const image = new Image();
    // load event is run when the image has been downloaded and is ready
    image.addEventListener("load", () => {
      resolve(image);
    });
    image.src = url;
  });
}

// ? returns data retrieved from the provided url (JSON)
export function loadJSON(url) {
  return fetch(url).then((r) => r.json());
}


