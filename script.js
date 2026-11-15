let quran = [];
let quranLoaded = false;

// أسماء السور
const surahNames = [
    "الفاتحة", "البقرة", "آل عمران", "النساء",
    "المائدة", "الأنعام", "الأعراف", "الأنفال",
    "التوبة", "يونس", "هود", "يوسف",
    "الرعد", "إبراهيم", "الحجر", "النحل",
    "الإسراء", "الكهف", "مريم", "طه",
    "الأنبياء", "الحج", "المؤمنون", "النور",
    "الفرقان", "الشعراء", "النمل", "القصص",
    "العنكبوت", "الروم", "لقمان", "السجدة",
    "الأحزاب", "سبأ", "فاطر", "يس",
    "الصافات", "ص", "الزمر", "غافر",
    "فصلت", "الشورى", "الزخرف", "الدخان",
    "الجاثية", "الأحقاف", "محمد", "الفتح",
    "الحجرات", "ق", "الذاريات", "الطور",
    "النجم", "القمر", "الرحمن", "الواقعة",
    "الحديد", "المجادلة", "الحشر", "الممتحنة",
    "الصف", "الجمعة", "المنافقون", "التغابن",
    "الطلاق", "التحريم", "الملك", "القلم",
    "الحاقة", "المعارج", "نوح", "الجن",
    "المزمل", "المدثر", "القيامة", "الإنسان",
    "المرسلات", "النبأ", "النازعات", "عبس",
    "التكوير", "الانفطار", "المطففين", "الانشقاق",
    "البروج", "الطارق", "الأعلى", "الغاشية",
    "الفجر", "البلد", "الشمس", "الليل",
    "الضحى", "الشرح", "التين", "العلق",
    "القدر", "البينة", "الزلزلة", "العاديات",
    "القارعة", "التكاثر", "العصر", "الهمزة",
    "الفيل", "قريش", "الماعون", "الكوثر",
    "الكافرون", "النصر", "المسد", "الإخلاص",
    "الفلق", "الناس"
];


// تحويل الأرقام العربية إلى إنجليزية
function normalizeNumbers(text) {
    return text
        .replace(/[٠-٩]/g, d => "0123456789"["٠١٢٣٤٥٦٧٨٩".indexOf(d)])
        .replace(/[۰-۹]/g, d => "0123456789"["۰۱۲۳۴۵۶۷۸۹".indexOf(d)]);
}


// تحميل القرآن
async function loadQuran() {

    const results = document.getElementById("results");

    try {

        const response = await fetch("./quran-simple.txt");

        if (!response.ok) {
            throw new Error("لم يتم العثور على ملف القرآن");
        }

        const data = await response.text();

        quran = data
            .split(/\r?\n/)
            .filter(line => line.trim() !== "");

        quranLoaded = true;

        results.textContent = "القرآن الكريم جاهز للبحث";

    } catch (error) {

        results.textContent = "حدث خطأ أثناء تحميل القرآن الكريم";

        console.error(error);

    }
}


// إزالة التشكيل
function normalizeArabic(text) {

    return text
        .replace(/[\u064B-\u065F\u0670]/g, "")
        .replace(/ـ/g, "")
        .replace(/[أإآٱ]/g, "ا")
        .replace(/ى/g, "ي")
        .trim();

}


// إنشاء عنصر الآية
function createVerse(surah, ayah, verse, highlight = false) {

    const result = document.createElement("div");

    result.className = highlight
        ? "result selected-ayah"
        : "result";

    const verseText = document.createElement("p");

    verseText.textContent = verse;

    const verseInfo = document.createElement("small");

    verseInfo.textContent =
        `سورة ${surahNames[surah - 1]} | الآية ${ayah}`;

    result.appendChild(verseText);
    result.appendChild(verseInfo);

    return result;
}


// فتح سورة كاملة مع إمكانية تحديد آية
function openSurah(surahNumber, targetAyah = null) {

    const results = document.getElementById("results");

    results.innerHTML = "";

    const surah = Number(surahNumber);

    if (surah < 1 || surah > 114) {

        results.textContent = "رقم السورة غير صحيح";

        return;
    }

    const surahVerses = quran
        .map(line => line.split("|"))
        .filter(parts =>
            parts.length === 3 &&
            Number(parts[0].trim()) === surah
        );

    if (surahVerses.length === 0) {

        results.textContent = "لم يتم العثور على السورة";

        return;
    }

    if (
        targetAyah !== null &&
        !surahVerses.some(parts =>
            Number(parts[1].trim()) === targetAyah
        )
    ) {

        results.textContent = "رقم الآية غير موجود في هذه السورة";

        return;
    }

    // عنوان السورة
    const title = document.createElement("h2");

    title.textContent = "سورة " + surahNames[surah - 1];

    results.appendChild(title);

    // عرض جميع آيات السورة
    surahVerses.forEach(parts => {

        const ayahNumber = Number(parts[1].trim());

        const verse = parts[2].trim();

        const isTarget = ayahNumber === targetAyah;

        const verseElement = createVerse(
            surah,
            ayahNumber,
            verse,
            isTarget
        );

        results.appendChild(verseElement);

        if (isTarget) {
            verseElement.id = "selectedAyah";
        }

    });

    // الانتقال إلى الآية المطلوبة
    if (targetAyah !== null) {

        const selected = document.getElementById("selectedAyah");

        if (selected) {
            selected.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }

    }

}


// البحث في القرآن
function searchQuran() {

    const inputElement = document.getElementById("searchInput");

    const results = document.getElementById("results");

    const input = normalizeNumbers(inputElement.value.trim());

    results.innerHTML = "";

    if (!quranLoaded) {

        results.textContent = "انتظر حتى يتم تحميل القرآن الكريم";

        return;
    }

    if (input === "") {

        results.textContent = "اكتب كلمة أو رقمًا للبحث";

        return;
    }

    // البحث عن سورة وآية مثل 1/5
    const reference = input.match(/^(\d+)\s*[/:-]\s*(\d+)$/);

    if (reference) {

        const surahNumber = Number(reference[1]);

        const ayahNumber = Number(reference[2]);

        openSurah(surahNumber, ayahNumber);

        return;
    }

    // فتح سورة باستخدام رقمها فقط
    if (/^\d+$/.test(input)) {

        openSurah(Number(input));

        return;
    }

    // البحث النصي
    const searchText = normalizeArabic(input);

    let count = 0;

    quran.forEach(line => {

        const parts = line.split("|");

        if (parts.length !== 3) return;

        const surah = Number(parts[0].trim());

        const ayah = Number(parts[1].trim());

        const verse = parts[2].trim();

        if (normalizeArabic(verse).includes(searchText)) {

            const verseElement = createVerse(
                surah,
                ayah,
                verse
            );

            results.appendChild(verseElement);

            count++;

        }

    });

    if (count === 0) {

        results.textContent = "لم يتم العثور على نتائج";

    } else {

        const heading = document.createElement("h3");

        heading.textContent = `نتائج البحث: ${count}`;

        results.prepend(heading);

    }

}


// ربط زر البحث
document.addEventListener("DOMContentLoaded", function () {

    const button = document.getElementById("searchButton");

    const input = document.getElementById("searchInput");

    if (button) {

        button.addEventListener("click", searchQuran);

    }

    if (input) {

        input.addEventListener("keydown", function(event) {

            if (event.key === "Enter") {

                searchQuran();

            }

        });

    }

    loadQuran();

});