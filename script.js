
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
    // console.log(result);
    let images = result.photos;
    images = images.slice(0, 18);
    const parent = document.querySelector(".imagesDisplay");
    images.forEach((photo) => {
        const img = document.createElement("img");
        img.src = photo?.src.small;
        parent.appendChild(img);
    });
}

getImages();


// api call
let getOut = document.querySelector("#submit");


getOut.addEventListener("click", async function (e) {
    const model = document.querySelector("#aiSelect");
    console.log(model.value);

    try {
        let api_key = document.querySelector("#key").value;
        console.log(api_key);
        let prompt = document.querySelector("#input").value;
        console.log(prompt);

        if (model.value === "stableDiffusion") {
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
                "num_inference_steps": "30",
                "safety_checker": "no",
                "enhance_prompt": "yes",
                "seed": null,
                "guidance_scale": 7.5,
                "multi_lingual": "no",
                "panorama": "no",
                "self_attention": "no",
                "upscale": "no",
                "embeddings_model": null,
                "lora_model": null,
                "tomesd": "yes",
                "use_karras_sigmas": "yes",
                "vae": null,
                "lora_strength": null,
                "scheduler": "UniPCMultistepScheduler",
                "webhook": null,
                "track_id": null
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
                .then(result => console.log(result, prompt))
                .catch(error => console.log('error', error))

        } else if (model.value === "openAi") {
            e.preventDefault();

            const url = "https://api.openai.com/v1/images/generations";
            const reqBody = {
                prompt,
                n: 1,
                size: '512x512',
                response_format: 'url',
            }

            const reqParams = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${api_key}`,
                },
                body: JSON.stringify(reqBody),
            }

            await fetch(url, reqParams)
                .then(response => {
                    if (response.ok) {
                        response.json();
                        displayOpenAiImages(response);
                    } else {
                        throw new Error('Request failed!');
                        showErrorMessage();
                    }
                })
                // .then(result => displayOpenAiImages(result, prompt))
                .catch(error => console.log('error', error));

        } else {
            e.preventDefault();
            alert("Please select a model.");
        }
    } catch (error) {
        console.log(error);
    }
});

function displayStableDiffusionImages(result, prompt) {
    try {
        const hide = document.querySelector(".content");
        hide.style.display = "none";

        const image = result.output[0];
        console.log(image);

        // Image Container
        const imgSection = document.querySelector(".imgContainer");
        const imgDiv = document.createElement("div");
        imgSection.appendChild(imgDiv);
        imgDiv.classList.add("imgDiv");

        // Image
        const img = document.createElement("img");
        img.src = image;
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
        const header = document.createElement("p");
        header.innerText = 'Prompt: ' + prompt;
        imgDiv.appendChild(header);

    } catch (error) {
        console.log(error);
    }
}

function displayOpenAiImages(response, prompt) {
    try {
        // const hide = document.querySelector(".content");
        // hide.style.display = "none";

        // const image = response.data.url;

        // // Image Container
        // const imgSection = document.querySelector(".imgContainer");
        // const imgDiv = document.createElement("div");
        // imgSection.appendChild(imgDiv);
        // imgDiv.classList.add("imgDiv");

        // // Image
        // const img = document.createElement("img");
        // img.src = image;
        // imgDiv.appendChild(img);

        // // Download Button
        // const imgLink = document.createElement("button");
        // imgLink.href = image;
        // imgLink.download = "image.png";
        // imgLink.textContent = "Download Image";
        // imgDiv.appendChild(imgLink);
        // imgLink.addEventListener("click", function (e) {
        //     e.preventDefault();
        //     console.log("clicked");
        //     window.open(image);
        // });
        // imgLink.classList.add("downloadBtn");

        // //header
        // const header = document.querySelector("h4");
        // header.textContent = prompt;
        // imgDiv.appendChild(header);

        alert("OpenAI API is not working. Please try again later.");

    } catch (error) {
        console.log(error);
    }
}


function showErrorMessage() {
    const showErr = document.createElement("h3");
    showErr.textContent = "Failed to fetch data! Please try again.";
    document.querySelector(".imgContainer").appendChild(showErr);
}