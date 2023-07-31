
// main page load image
const apiPexels = "jpwY4q8qaTcPjZyQ9jBPnuWcCbB88mDXUmlwdCZnmH8XZWheCfJuAdxZ";

async function getImages() {
    const url = `https://api.pexels.com/v1/search?query=art&width=512&per_page=80`;
    const data = await fetch(url, {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: apiPexels,
        },
    });
    const result = await data.json();
    console.log(result);
    let images = result.photos;
    let responsiveImages = images.slice(0, 6);

    //tablet and laptop
    images = images.slice(0, 16);
    const parent = document.querySelector(".imagesDisplay");
    images.forEach((photo) => {
        const img = document.createElement("img");
        img.src = photo?.src.small;
        img.title = photo?.alt;
        img.onclick = function () {
            window.open(photo?.src.original);
        };
        parent.appendChild(img);
    });

    //mobile
    const parent2 = document.querySelector(".responsiveImagesDisplay");
    responsiveImages.forEach((photo) => {
        const img = document.createElement("img");
        img.src = photo?.src.small;
        img.title = photo?.alt;
        img.onclick = function () {
            window.open(photo?.src.original);
        };
        parent2.appendChild(img);
    });
}

getImages();


// api call
let getOut = document.querySelector("#submit");


getOut.addEventListener("click", async function (e) {
    e.preventDefault();

    const loader = document.querySelector(".imgLoader");
    const btnHide = document.querySelector("#submit");
    try {
        let api_key = document.querySelector("#key").value;
        console.log(api_key);
        let prompt = document.querySelector("#input").value;
        console.log(prompt);

        loader.style.display = "block";
        btnHide.style.display = "none";


        const url = 'https://stablediffusionapi.com/api/v4/dreambooth';
        e.preventDefault();
        // console.log("clicked");

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        let raw = JSON.stringify({
            "key": api_key,
            "model_id": "midjourney",
            "prompt": prompt,
            "negative_prompt": null,
            "width": "512",
            "height": "512",
            "samples": "1",
        });

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        await fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => displayStableDiffusionImages(result, prompt))
            .then(() => {
                loader.style.display = "none";
                btnHide.style.display = "block";
            })
            .catch(error => console.log('error', error));
    } catch (error) {
        console.log(error);
    }
});

function displayStableDiffusionImages(result, prompt) {
    try {
        const loader = document.querySelector(".imgLoader");
        loader.style.display = "block";

        const hide = document.querySelector(".content");
        hide.style.display = "none";

        const image = result.output[0];
        console.log(result);


        // Image Container
        const imgSection = document.querySelector(".imgContainer");
        const imgDiv = document.createElement("div");
        imgSection.appendChild(imgDiv);
        imgDiv.classList.add("imgDiv");

        // Image
        const img = document.createElement("img");
        img.src = image;
        img.alt = prompt;
        img.title = prompt;
        imgDiv.appendChild(img);


        // Download Button
        const imgLink = document.createElement("button");
        imgLink.href = image;
        imgLink.download = "image.png";
        imgLink.textContent = "Download Image";
        imgDiv.appendChild(imgLink);
        imgLink.addEventListener("click", function (e) {
            e.preventDefault();
            console.log("clicked");
            window.open(image);
        });
        imgLink.classList.add("downloadBtn");

        //header
        // const header = document.createElement("p");
        // header.innerText = 'Prompt: ' + prompt;
        // imgDiv.appendChild(header);

    } catch (error) {
        console.log(error);

        const err = document.createElement("p");
        err.innerHTML = 'Error: Please try again later.';

        const imgSection = document.querySelector(".imgContainer");
        imgSection.appendChild(err);

    }
}


// Utils

function showMenu () {
    const menu = document.querySelector(".menu");
    menu.classList.toggle("showMenu");
}