// ضع مفتاح YouTube API هنا
const API_KEY = "AIzaSyA-xdkeVAjzUhvSxb59jm0D0Jly3qrXqq8";
console.log("API Key configured:", API_KEY !== "YOUR_API_KEY");

// عناصر الصفحة
const searchInput = document.getElementById("videoSearchInput");
const searchButton = document.getElementById("videoSearchButton");
const videoResults = document.getElementById("videoResults");
const videoPlayer = document.getElementById("videoPlayer");

// البحث عن فيديوهات القرآن
async function searchVideos() {

    const surahName = searchInput.value.trim();

    if (!surahName) {
        videoResults.textContent = "اكتب اسم السورة أولاً";
        return;
    }

    if (API_KEY === "YOUR_API_KEY") {
        videoResults.textContent = "يجب إضافة مفتاح API أولاً";
        return;
    }

    videoResults.textContent = "جاري البحث عن الفيديوهات...";
    videoPlayer.innerHTML = "";

    const query = `تلاوة سورة ${surahName}`;

    const url = new URL(
        "https://www.googleapis.com/youtube/v3/search"
    );

    url.search = new URLSearchParams({
        part: "snippet",
        q: query,
        type: "video",
        maxResults: "10",
        order: "relevance",
        relevanceLanguage: "ar",
        regionCode: "EG",
        videoEmbeddable: "true",
        safeSearch: "strict",
        key: API_KEY
    });

    try {

        const response = await fetch(url);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error?.message || "حدث خطأ أثناء البحث"
            );
        }

        videoResults.innerHTML = "";

        if (!data.items || data.items.length === 0) {
            videoResults.textContent = "لم يتم العثور على فيديوهات";
            return;
        }

        data.items.forEach(video => {

            const videoId = video.id.videoId;

            const title = video.snippet.title;

            const channel = video.snippet.channelTitle;

            const thumbnail = video.snippet.thumbnails.medium.url;

            // إنشاء بطاقة الفيديو
            const card = document.createElement("div");

            card.className = "video-card";

            card.innerHTML = `
                <img src="${thumbnail}" alt="صورة الفيديو">

                <h3></h3>

                <p></p>

                <button type="button">
                    تشغيل الفيديو
                </button>
            `;

            card.querySelector("h3").textContent = title;
            card.querySelector("p").textContent = channel;

            card.querySelector("button").addEventListener(
                "click",
                () => playVideo(videoId)
            );

            videoResults.appendChild(card);

        });

    } catch (error) {

        console.error(error);

        videoResults.textContent =
            "حدث خطأ: " + error.message;

    }
}


// تشغيل الفيديو داخل الموقع
function playVideo(videoId) {

    videoPlayer.innerHTML = `
        <iframe
            width="100%"
            height="400"
            src="https://www.youtube.com/embed/${encodeURIComponent(videoId)}"
            title="Quran Video Player"
            frameborder="0"
            allowfullscreen>
        </iframe>
    `;

    videoPlayer.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


// زر البحث
searchButton.addEventListener("click", searchVideos);


// البحث باستخدام Enter
searchInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        searchVideos();
    }

});