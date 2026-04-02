/**
 * Fallback mapping to ensure the 40 core classic books ALWAYS receive their 
 * high-quality reliable local cover directly from the filesystem, regardless 
 * of the database state or external API limits. This is especially useful 
 * if deployed to Vercel on a fresh/different database instance.
 */
export const LOCAL_COVERS: Record<string, string> = {
    "Қылмыс пен жаза": "/covers/1.jpg",
    "Карамазов бауырлар": "/covers/2.jpg",
    "Соғыс және бейбітшілік": "/covers/3.jpg",
    "Анна Каренина": "/covers/4.jpg",
    "Жалғыздықтың жүз жылы": "/covers/5.jpg",
    "Мың тоғыз жүз сексен төрт": "/covers/6.jpg",
    "Жануарлар қожалығы": "/covers/7.jpg",
    "Айналу": "/covers/8.jpg",
    "Қарт және теңіз": "/covers/9.jpg",
    "Бөтен адам": "/covers/10.jpg",
    "Кішкентай ханзада": "/covers/11.jpg",
    "Мақтаныш пен алалық": "/covers/12.jpg",
    "Сайрауықты өлтірме": "/covers/13.jpg",
    "Ақымақ": "/covers/14.jpg",
    "Сизиф туралы миф": "/covers/15.jpg",
    "Сезім мен сезімталдық": "/covers/16.jpg",
    "Тырысқақ кезіндегі махаббат": "/covers/17.jpg",
    "Күн де шығады": "/covers/18.jpg",
    "Сот": "/covers/19.jpg",
    "Мерекелі той": "/covers/20.jpg",
    "Шебер мен Маргарита": "/covers/21.jpg",
    "Доктор Живаго": "/covers/23.jpg",
    "Сиқырлы тау": "/covers/24.jpg",
    "Мисс Дэллоуэй": "/covers/25.jpg",
    "Мадам Бовари": "/covers/26.jpg",
    "Ұлы Гэтсби": "/covers/28.jpg",
    "Тышқандар мен адамдар туралы": "/covers/29.jpg",
    "Екі қала тарихы": "/covers/30.jpg",
    "Шие бағы": "/covers/31.jpg",
    "Өлі жандар": "/covers/32.jpg",
    "Екінші жыныс": "/covers/34.jpg",
    "Қара бидайдағы аңшы": "/covers/35.jpg",
    "Ақылды жүрек": "/covers/36.jpg",
    "Теңіз астында жиырма мың миль": "/covers/37.jpg",
    "Оба": "/covers/38.jpg",
    "Сарай": "/covers/39.jpg",
    "Дон Кихот": "/covers/40.jpg",
};

export function getMappedCoverUrl(titleKz: string, originalUrl: string | null): string | null {
    if (!titleKz) return originalUrl;

    // 1. Exact match (fastest)
    if (LOCAL_COVERS[titleKz]) {
        return LOCAL_COVERS[titleKz];
    }

    const normalize = (str: string) => 
        str.toLowerCase().trim().replace(/[.,!?;:\-()"']/g, '').replace(/\s+/g, ' ');
        
    const nTitle = normalize(titleKz);

    // 2. Normalized exact match
    for (const [key, value] of Object.entries(LOCAL_COVERS)) {
        if (normalize(key) === nTitle) {
            return value;
        }
    }

    // 3. Substring match (e.g. if DB has "Қылмыс пен жаза (Роман)")
    for (const [key, value] of Object.entries(LOCAL_COVERS)) {
        const nKey = normalize(key);
        // Ensure string is decently long to avoid false positives with short titles
        if (nKey.length > 4 && nTitle.includes(nKey)) {
            return value;
        }
    }

    // Otherwise use whatever is in the DB
    return originalUrl;
}
