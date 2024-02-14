export const SCREEN_SIZES = {
    sm: { width: 480, height: 640 },
    md: { width: 1024, height: 768 },
    lg: { width: 1280, height: 720 },
};

export async function fontAwesomeToImage(iframeContentDocument: Document) {
    const fontAwesomeItems = iframeContentDocument.querySelectorAll("i.fab, i.fas, i.far");

    const svgTasks = Array.from(fontAwesomeItems).map(async (iconElement) => {

        const iconStyle = iconElement.classList.contains("fas") ? "solid" :
            iconElement.classList.contains("far") ? "regular" :
                iconElement.classList.contains("fab") ? "brands" : "";

        const iconNameClass = Array.from(iconElement.classList).find(cls => cls.startsWith("fa-"));
        if (iconNameClass) {
            const iconName = iconNameClass.replace("fa-", "");
            const imgElement = document.createElement("img");
            const svgString = await fetchSvgContent(iconName, iconStyle);

            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = svgString;
            const svgElement = tempDiv.querySelector("svg") as SVGElement;

            const { color: computedColor, fontSize: computedFontSize } = window.getComputedStyle(iconElement);
            svgElement.setAttribute("fill", computedColor);

            const fontSize = computedFontSize || "20px";
            const width = (iconElement as HTMLElement).style.width || fontSize;
            const height = (iconElement as HTMLElement).style.height || fontSize;
            svgElement.setAttribute("width", width);
            imgElement.setAttribute("width", width);
            svgElement.setAttribute("height", height);
            imgElement.setAttribute("height", height);

            const classList = Array.from(iconElement.classList);
            const filteredClassList = classList.filter(cls => !["fab", "fas", "far", "fa-" + iconName].includes(cls));
            imgElement.setAttribute("class", filteredClassList.join(" "));
            imgElement.style.display = "inline-block";

            const base64SVG = btoa(svgElement.outerHTML);
            imgElement.setAttribute("src", `data:image/svg+xml;base64,${ base64SVG }`);

            tempDiv.remove();
            iconElement.replaceWith(imgElement);
        }
    });


    await Promise.all(svgTasks);
}

export async function patchAllImages(iframeContentDocument: Document) {

    const images = iframeContentDocument.querySelectorAll("img");

    const tasks = Array.from(images).map(async (img) => {
        const src = img.getAttribute("src");
        if (src && !src.startsWith("data:")) {
            try {
                const dataURL = await imageToDataURL(src);
                img.setAttribute("src", dataURL);
            } catch (error) {
                console.error(`Failed to convert image: ${ src }`);
            }
        }
    });

    await Promise.all(tasks);
}

export async function patchAllBackgroundImages(iframeContentDocument: Document) {
    const elements = iframeContentDocument.querySelectorAll("*");

    const tasks = Array.from(elements).map(async (element) => {
        const style = window.getComputedStyle(element);
        const backgroundImage = style.backgroundImage;

        if (backgroundImage && backgroundImage !== "none") {
            const urlMatch = backgroundImage.match(/url\("?(.*?)"?\)/);
            if (urlMatch) {
                const url = urlMatch[1];
                if (!url.startsWith("data:")) {
                    try {
                        const dataURL = await imageToDataURL(url);
                        (element as HTMLElement).style.backgroundImage = `url(${ dataURL })`;
                    } catch (error) {
                        console.error(`Failed to convert background image: ${ url }`);
                    }
                }
            }
        }
    });

    await Promise.all(tasks);
}

export async function blockAllClicks(iframeContentDocument: Document) {
    const elements = iframeContentDocument.querySelectorAll("*:not(body)");
    Array.from(elements).forEach((element) => {
        (element as HTMLElement).style.pointerEvents = "none";
    });
}

export async function imageToDataURL(imageURL: string): Promise<string> {
    try {
        const response = await fetch(imageURL);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error("Error fetching image:", error);
        throw error;
    }
}

export async function fetchSvgContent(iconName: string, style: string): Promise<string> {
    const svgPath = `https://www.texttodesign.ai/svgs/${ style }/${ iconName }.svg`;
    try {
        const response = await fetch(`https://qib2z7fbh6.execute-api.us-east-1.amazonaws.com/prod/proxy?url=${ encodeURIComponent(svgPath) }`);
        if (!response.ok) throw new Error("SVG file not found.");
        return response.text();
    } catch (error) {
        console.warn(`SVG file not found for ${ iconName }, using default SVG.`);
        const defaultSvgPath = "https://www.texttodesign.ai/svgs/regular/image.svg";
        const defaultResponse = await fetch(`https://qib2z7fbh6.execute-api.us-east-1.amazonaws.com/prod/proxy?url=${ encodeURIComponent(defaultSvgPath) }`);
        if (!defaultResponse.ok) throw new Error("Default SVG file not found.");
        return defaultResponse.text();
    }
}