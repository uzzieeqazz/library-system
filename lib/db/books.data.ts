/**
 * books.data.ts
 *
 * Single source of truth for the library catalog.
 * Hardcoded here ONLY what cannot be auto-fetched:
 *   - Kazakh title (literary translation — machine translation is unreliable for titles)
 *   - Kazakh description (short annotation for the reader)
 *   - Category in Kazakh
 *   - Author name (in the form used across the UI)
 *
 * Everything else — year, ISBN, cover — is fetched live from Open Library.
 * To add a new book: append one entry to CATALOG and re-run `npm run db:seed`.
 */

export interface BookEntry {
    /** Search query sent to Open Library to identify the correct edition */
    olSearch: { title: string; author: string };
    /** Kazakh display title */
    titleKz: string;
    /** Author name shown in the UI */
    authorName: string;
    /** Short author biography in Kazakh */
    authorBio: string;
    /** Kazakh annotation / description */
    descriptionKz: string;
    /** Category key — must match a name in CATEGORIES */
    category: string;
    /** Approximate copies in the library */
    totalCopies: number;
}

export const CATEGORIES: string[] = [
    "Роман",
    "Ғылыми-фантастика",
    "Тарих",
    "Философия",
    "Поэзия",
    "Психология",
    "Детектив",
    "Балалар",
];

export const CATALOG: BookEntry[] = [
    {
        olSearch: { title: "Crime and Punishment", author: "Dostoevsky" },
        titleKz: "Қылмыс пен жаза",
        authorName: "Фёдор Достоевский",
        authorBio: "Орыс жазушысы, психологиялық романдарымен танымал әлем классигі.",
        descriptionKz:
            "Студент Раскольников кісі өлтіргеннен кейін психологиялық азапты бастан өткізеді. Достоевскийдің ең ұлы туындыларының бірі.",
        category: "Роман",
        totalCopies: 5,
    },
    {
        olSearch: { title: "The Brothers Karamazov", author: "Dostoevsky" },
        titleKz: "Карамазов бауырлар",
        authorName: "Фёдор Достоевский",
        authorBio: "Орыс жазушысы, психологиялық романдарымен танымал әлем классигі.",
        descriptionKz:
            "Достоевскийдің соңғы ұлы туындысы — от, сенім және адам табиғаты туралы терең философиялық роман.",
        category: "Философия",
        totalCopies: 4,
    },
    {
        olSearch: { title: "War and Peace", author: "Tolstoy" },
        titleKz: "Соғыс және бейбітшілік",
        authorName: "Лев Толстой",
        authorBio: "Орыс жазушысы, эпикалық романдарымен бүкіл әлемге танымал классик.",
        descriptionKz:
            "Наполеон соғысы дәуіріндегі орыс қоғамын суреттейтін, ұрпақтан ұрпаққа жеткен ұлы эпопея.",
        category: "Роман",
        totalCopies: 6,
    },
    {
        olSearch: { title: "Anna Karenina", author: "Tolstoy" },
        titleKz: "Анна Каренина",
        authorName: "Лев Толстой",
        authorBio: "Орыс жазушысы, эпикалық романдарымен бүкіл әлемге танымал классик.",
        descriptionKz:
            "Махаббат, намыс және қоғам нормалары туралы Толстойдың ұлы трагедиялық романы.",
        category: "Роман",
        totalCopies: 5,
    },
    {
        olSearch: { title: "One Hundred Years of Solitude", author: "Garcia Marquez" },
        titleKz: "Жалғыздықтың жүз жылы",
        authorName: "Габриэль Гарсиа Маркес",
        authorBio: "Колумбиялық жазушы, Нобель сыйлығының лауреаты, сиқырлы реализмнің шебері.",
        descriptionKz:
            "Буэндиа әулетінің жеті буын тарихын баяндайтын сиқырлы реализм шедеврі.",
        category: "Роман",
        totalCopies: 4,
    },
    {
        olSearch: { title: "Nineteen Eighty-Four", author: "George Orwell" },
        titleKz: "Мың тоғыз жүз сексен төрт",
        authorName: "Джордж Оруэлл",
        authorBio: "Ағылшын жазушысы, антиутопиялық романдарымен бүкіл әлемге мәлім.",
        descriptionKz:
            "Тоталитарлық режим туралы ең ықпалды антиутопиялық роман. \"Үлкен аға сені бақылайды\".",
        category: "Ғылыми-фантастика",
        totalCopies: 5,
    },
    {
        olSearch: { title: "Animal Farm", author: "George Orwell" },
        titleKz: "Жануарлар қожалығы",
        authorName: "Джордж Оруэлл",
        authorBio: "Ағылшын жазушысы, антиутопиялық романдарымен бүкіл әлемге мәлім.",
        descriptionKz:
            "Саяси сатира ретінде жазылған аллегориялық шығарма — тоталитаризмді жануарлар бейнесінде сынайды.",
        category: "Роман",
        totalCopies: 4,
    },
    {
        olSearch: { title: "The Metamorphosis", author: "Franz Kafka" },
        titleKz: "Айналу",
        authorName: "Франц Кафка",
        authorBio: "Чех жазушысы, абсурд пен экзистенциализм тақырыптарының белгілі өкілі.",
        descriptionKz:
            "Бір таңертең жәндікке айналып кеткен Грегор Замзаның трагикалық оқиғасы.",
        category: "Роман",
        totalCopies: 3,
    },
    {
        olSearch: { title: "The Old Man and the Sea", author: "Ernest Hemingway" },
        titleKz: "Қарт және теңіз",
        authorName: "Эрнест Хемингуэй",
        authorBio: "Американдық жазушы, Нобель сыйлығының лауреаты, айсберг стилінің атасы.",
        descriptionKz:
            "Кәрі балықшы Сантьягоның алып балықпен жекпе-жегін суреттейтін Нобель сыйлығын әперген шығарма.",
        category: "Роман",
        totalCopies: 4,
    },
    {
        olSearch: { title: "The Stranger", author: "Albert Camus" },
        titleKz: "Бөтен адам",
        authorName: "Альбер Камю",
        authorBio: "Француз жазушысы мен философы, абсурдизм ағымының негізін салушы.",
        descriptionKz:
            "Абсурдизм мен экзистенциализмнің символы болған Мерсоның жатсыну тарихы.",
        category: "Философия",
        totalCopies: 3,
    },
    {
        olSearch: { title: "The Little Prince", author: "Antoine de Saint-Exupery" },
        titleKz: "Кішкентай ханзада",
        authorName: "Антуан де Сент-Экзюпери",
        authorBio: "Француз жазушысы, «Кішкентай ханзада» кітабының авторы.",
        descriptionKz:
            "Барлық жастағы оқырмандарға арналған философиялық ертегі — махаббат, достық және жоғалу туралы.",
        category: "Балалар",
        totalCopies: 6,
    },
    {
        olSearch: { title: "Pride and Prejudice", author: "Jane Austen" },
        titleKz: "Мақтаныш пен алалық",
        authorName: "Джейн Остин",
        authorBio: "Ағылшын жазушысы, романтикалық роман жанрының классигі.",
        descriptionKz:
            "Элизабет Беннет пен Дарси мырзаның махаббат тарихы — ағылшын классикасының шедеврі.",
        category: "Роман",
        totalCopies: 4,
    },
    {
        olSearch: { title: "To Kill a Mockingbird", author: "Harper Lee" },
        titleKz: "Сайрауықты өлтірме",
        authorName: "Харпер Ли",
        authorBio: "Американдық жазушы, Пулитцер сыйлығының лауреаты.",
        descriptionKz:
            "Нәсілдік теңсіздік пен балалық қауымдастық тарихын суреттейтін Пулитцер сыйлықты роман.",
        category: "Роман",
        totalCopies: 5,
    },
    {
        olSearch: { title: "The Idiot", author: "Dostoevsky" },
        titleKz: "Ақымақ",
        authorName: "Фёдор Достоевский",
        authorBio: "Орыс жазушысы, психологиялық романдарымен танымал әлем классигі.",
        descriptionKz:
            "Мейірімді де кіршіксіз ханзада Мышкиннің орыс қоғамымен қақтығысы.",
        category: "Роман",
        totalCopies: 3,
    },
    {
        olSearch: { title: "The Myth of Sisyphus", author: "Albert Camus" },
        titleKz: "Сизиф туралы миф",
        authorName: "Альбер Камю",
        authorBio: "Француз жазушысы мен философы, абсурдизм ағымының негізін салушы.",
        descriptionKz:
            "Адам өмірінің мағынасы мен абсурды туралы Камюдің негізгі философиялық эссесі.",
        category: "Философия",
        totalCopies: 2,
    },
    {
        olSearch: { title: "Sense and Sensibility", author: "Jane Austen" },
        titleKz: "Сезім мен сезімталдық",
        authorName: "Джейн Остин",
        authorBio: "Ағылшын жазушысы, романтикалық роман жанрының классигі.",
        descriptionKz:
            "Эллинор мен Марианнаның тағдыры арқылы сезім мен парасаттың тартысын суреттейтін роман.",
        category: "Роман",
        totalCopies: 3,
    },
    {
        olSearch: { title: "Love in the Time of Cholera", author: "Garcia Marquez" },
        titleKz: "Тырысқақ кезіндегі махаббат",
        authorName: "Габриэль Гарсиа Маркес",
        authorBio: "Колумбиялық жазушы, Нобель сыйлығының лауреаты, сиқырлы реализмнің шебері.",
        descriptionKz:
            "Флорентино Арисаның жиырма жылы асқан шыдамды, кемеңгер сүйіспеншілік тарихы.",
        category: "Роман",
        totalCopies: 3,
    },
    {
        olSearch: { title: "The Sun Also Rises", author: "Ernest Hemingway" },
        titleKz: "Күн де шығады",
        authorName: "Эрнест Хемингуэй",
        authorBio: "Американдық жазушы, Нобель сыйлығының лауреаты, айсберг стилінің атасы.",
        descriptionKz:
            "Жоғалған ұрпақтың Париж бен Памплонадағы тіршілігін суреттейтін Хемингуэйдің бірінші романы.",
        category: "Роман",
        totalCopies: 4,
    },
    {
        olSearch: { title: "The Trial", author: "Franz Kafka" },
        titleKz: "Сот",
        authorName: "Франц Кафка",
        authorBio: "Чех жазушысы, абсурд пен экзистенциализм тақырыптарының белгілі өкілі.",
        descriptionKz:
            "Иосиф К. белгісіз айыппен сотталатын — кафкалық абсурд пен бюрократия туралы ерекше роман.",
        category: "Роман",
        totalCopies: 3,
    },
    {
        olSearch: { title: "A Moveable Feast", author: "Ernest Hemingway" },
        titleKz: "Мерекелі той",
        authorName: "Эрнест Хемингуэй",
        authorBio: "Американдық жазушы, Нобель сыйлығының лауреаты, айсберг стилінің атасы.",
        descriptionKz:
            "Хемингуэйдің 1920-жылдардағы Парижіндегі өмірін суреттейтін мемуарлық шедевр.",
        category: "Роман",
        totalCopies: 2,
    },

    // ── 21–40 ───────────────────────────────────────────────────────────────

    {
        olSearch: { title: "The Master and Margarita", author: "Bulgakov" },
        titleKz: "Шебер мен Маргарита",
        authorName: "Михаил Булгаков",
        authorBio: "Орыс-кеңестік жазушы, драматург. Сатиралық шедеврлерімен танымал.",
        descriptionKz:
            "Мәскеуде пайда болған Сатана мен оның жолдастарының фантасмагориялық оқиғасы — ізгілік пен зұлымдық туралы ұлы роман.",
        category: "Мистика",
        totalCopies: 5,
    },
    {
        olSearch: { title: "Lolita", author: "Vladimir Nabokov" },
        titleKz: "Лолита",
        authorName: "Владимир Набоков",
        authorBio: "Орыс-американдық жазушы, поэт және аудармашы. Стильдік шеберлігімен танымал.",
        descriptionKz:
            "Набоковтың ең даулы және кекесінді шығармасы — тіл шебері мен моралдық күрделіліктің мысалы.",
        category: "Роман",
        totalCopies: 3,
    },
    {
        olSearch: { title: "Doctor Zhivago", author: "Boris Pasternak" },
        titleKz: "Доктор Живаго",
        authorName: "Борис Пастернак",
        authorBio: "Орыс ақыны мен жазушысы, Нобель сыйлығының лауреаты.",
        descriptionKz:
            "Революция мен азамат соғысы кезіндегі махаббат пен шығармашылық туралы эпикалық роман.",
        category: "Роман",
        totalCopies: 4,
    },
    {
        olSearch: { title: "The Magic Mountain", author: "Thomas Mann" },
        titleKz: "Сиқырлы тау",
        authorName: "Томас Манн",
        authorBio: "Неміс жазушысы, Нобель сыйлығының лауреаты, XX ғасыр прозасының алыбы.",
        descriptionKz:
            "Швейцариялық санаторийде жеті жыл өткізген Ганс Касторптың өмірі арқылы Еуропа мәдениеті мен ақыл-ойының панорамасы.",
        category: "Роман",
        totalCopies: 3,
    },
    {
        olSearch: { title: "Mrs Dalloway", author: "Virginia Woolf" },
        titleKz: "Мисс Дэллоуэй",
        authorName: "Вирджиния Вулф",
        authorBio: "Ағылшын жазушысы мен эссеист, модернизм ағымының жарқын өкілі.",
        descriptionKz:
            "Лондондағы бір күн ішінде болатын оқиға — сана ағымы техникасын шебер қолданған роман.",
        category: "Роман",
        totalCopies: 3,
    },
    {
        olSearch: { title: "Madame Bovary", author: "Gustave Flaubert" },
        titleKz: "Мадам Бовари",
        authorName: "Гюстав Флобер",
        authorBio: "Француз реализмінің атасы, стильге деген икемділігімен атақты жазушы.",
        descriptionKz:
            "Провинциялық дәрігердің өмірінен қиял іздеген Эмма Бовариның трагедиясы.",
        category: "Роман",
        totalCopies: 4,
    },
    {
        olSearch: { title: "Les Miserables", author: "Victor Hugo" },
        titleKz: "Зарлы адамдар",
        authorName: "Виктор Гюго",
        authorBio: "Француз жазушысы мен ақыны, романтизм дәуірінің ұлы өкілі.",
        descriptionKz:
            "Жан Вальжанның Франция революциясы кезіндегі өкіну мен сатып алу жолы — тарихтағы ең ықпалды романдардың бірі.",
        category: "Тарих",
        totalCopies: 5,
    },
    {
        olSearch: { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
        titleKz: "Ұлы Гэтсби",
        authorName: "Фрэнсис Скотт Фицджеральд",
        authorBio: "Американдық жазушы, «Джаз дәуірі» атанған 1920-жылдардың дауысы.",
        descriptionKz:
            "Американдық арман, байлық пен адасу туралы Фицджеральдтың ұлы романы.",
        category: "Роман",
        totalCopies: 5,
    },
    {
        olSearch: { title: "Of Mice and Men", author: "John Steinbeck" },
        titleKz: "Тышқандар мен адамдар туралы",
        authorName: "Джон Стейнбек",
        authorBio: "Американдық жазушы, Нобель сыйлығының лауреаты, әлеуметтік реализм шебері.",
        descriptionKz:
            "Ұлы депрессия кезіндегі Джордж пен Леннидің достық пен армандар туралы қозғалтқыш тарихы.",
        category: "Роман",
        totalCopies: 4,
    },
    {
        olSearch: { title: "A Tale of Two Cities", author: "Charles Dickens" },
        titleKz: "Екі қала тарихы",
        authorName: "Чарльз Диккенс",
        authorBio: "Ағылшын жазушысы, Виктория дәуірінің ең танымал прозашысы.",
        descriptionKz:
            "Француз революциясы кезіндегі Лондон мен Париж аясында болатын интригалы тарихи роман.",
        category: "Тарих",
        totalCopies: 4,
    },
    {
        olSearch: { title: "The Cherry Orchard", author: "Anton Chekhov" },
        titleKz: "Шие бағы",
        authorName: "Антон Чехов",
        authorBio: "Орыс жазушысы мен драматургі, қысқа әңгіме жанрының классигі.",
        descriptionKz:
            "Орыс дворяндарының өз иелігінен айырылуын суреттейтін Чеховтың соңғы драмасы.",
        category: "Роман",
        totalCopies: 3,
    },
    {
        olSearch: { title: "Dead Souls", author: "Nikolai Gogol" },
        titleKz: "Өлі жандар",
        authorName: "Николай Гоголь",
        authorBio: "Орыс жазушысы мен драматургі, орыс әдебиетінің негізін қалаушылардың бірі.",
        descriptionKz:
            "Чичиковтың «өлі жандарды» сатып алу алаяқтығы арқылы орыс қоғамын сатиралық суреттеген шедевр.",
        category: "Роман",
        totalCopies: 3,
    },
    {
        olSearch: { title: "Fathers and Sons", author: "Ivan Turgenev" },
        titleKz: "Аталар мен ұлдар",
        authorName: "Иван Тургенев",
        authorBio: "Орыс жазушысы, «нигилизм» ұғымын танымал еткен классик.",
        descriptionKz:
            "XIX ғасырдағы орыс зиялыларының ескілік пен жаңалық арасындағы идеологиялық қақтығысы.",
        category: "Роман",
        totalCopies: 3,
    },
    {
        olSearch: { title: "The Second Sex", author: "Simone de Beauvoir" },
        titleKz: "Екінші жыныс",
        authorName: "Симон де Бовуар",
        authorBio: "Француз экзистенциалист жазушысы мен философы, феминизм теориясының кейіпкері.",
        descriptionKz:
            "Феминизм тарихындағы іргелі шығарма — «Әйел болып тумайды, әйел болып қалыптасады».",
        category: "Философия",
        totalCopies: 3,
    },
    {
        olSearch: { title: "The Catcher in the Rye", author: "J. D. Salinger" },
        titleKz: "Қара бидайдағы аңшы",
        authorName: "Джером Дэвид Сэлинджер",
        authorBio: "Американдық жазушы, жасөспірімдер психологиясын суреттеген шедеврлерімен танымал.",
        descriptionKz:
            "Холден Колфилдтің Нью-Йоркте үш күн ішінде бастан кешіретін рухани дағдарысы.",
        category: "Роман",
        totalCopies: 4,
    },
    {
        olSearch: { title: "The Tell-Tale Heart", author: "Edgar Allan Poe" },
        titleKz: "Ақылды жүрек",
        authorName: "Эдгар Аллан По",
        authorBio: "Американдық жазушы мен ақын, детектив жанры мен қорқынышты әдебиеттің атасы.",
        descriptionKz:
            "Пораның жасырын жүрегі барған сайын өзінің сыпыра сезімтал кейіпкерін есінен тандырады.",
        category: "Детектив",
        totalCopies: 3,
    },
    {
        olSearch: { title: "Twenty Thousand Leagues Under the Sea", author: "Jules Verne" },
        titleKz: "Теңіз астында жиырма мың миль",
        authorName: "Жюль Верн",
        authorBio: "Француз жазушысы, ғылыми-фантастика жанрының атасы.",
        descriptionKz:
            "Капитан Немо мен оның суасты қайығы «Наутилустың» тылсым теңіз сапары.",
        category: "Ғылыми-фантастика",
        totalCopies: 4,
    },
    {
        olSearch: { title: "The Plague", author: "Albert Camus" },
        titleKz: "Оба",
        authorName: "Альбер Камю",
        authorBio: "Француз жазушысы мен философы, абсурдизм ағымының негізін салушы.",
        descriptionKz:
            "Оба індеті жайлаған қалада адамдардың тағдыры мен ерлігін суреттейтін экзистенциалдық роман.",
        category: "Роман",
        totalCopies: 4,
    },
    {
        olSearch: { title: "The Castle", author: "Franz Kafka" },
        titleKz: "Сарай",
        authorName: "Франц Кафка",
        authorBio: "Чех жазушысы, абсурд пен экзистенциализм тақырыптарының белгілі өкілі.",
        descriptionKz:
            "К. атты геодезист ешқашан ене алмайтын Сарайға жетуге тырысады — бюрократия мен жатсынудың символды романы.",
        category: "Роман",
        totalCopies: 2,
    },
    {
        olSearch: { title: "Don Quixote", author: "Miguel de Cervantes" },
        titleKz: "Дон Кихот",
        authorName: "Мигель де Сервантес",
        authorBio: "Испан жазушысы, «Дон Кихот» — дүниежүзілік әдебиеттің алғашқы заманауи романы.",
        descriptionKz:
            "Рыцарлық романдарды оқып есінен танған Дон Кихоттың шалжай және қозғалтқыш оқиғалары.",
        category: "Роман",
        totalCopies: 4,
    },
];

