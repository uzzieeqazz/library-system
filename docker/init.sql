--
-- PostgreSQL database dump
--

\restrict up2A3PWxC6x9dx2MCoENBoFWMtSdm7cCIRBsGahD46YE1Awk2oFU4WwWwo2CufV

-- Dumped from database version 15.14
-- Dumped by pg_dump version 15.14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: order_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.order_status AS ENUM (
    'pending',
    'approved',
    'returned',
    'cancelled'
);


--
-- Name: role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.role AS ENUM (
    'reader',
    'admin'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: authors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.authors (
    id integer NOT NULL,
    name text NOT NULL,
    bio text
);


--
-- Name: authors_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.authors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: authors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.authors_id_seq OWNED BY public.authors.id;


--
-- Name: books; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.books (
    id integer NOT NULL,
    title_kz text NOT NULL,
    author_id integer,
    category_id integer,
    isbn character varying(20),
    year integer,
    total_copies integer DEFAULT 1 NOT NULL,
    available_copies integer DEFAULT 1 NOT NULL,
    cover_url text,
    description_kz text
);


--
-- Name: books_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.books_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: books_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.books_id_seq OWNED BY public.books.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name_kz text NOT NULL
);


--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    user_id integer NOT NULL,
    book_id integer NOT NULL,
    status public.order_status DEFAULT 'pending'::public.order_status NOT NULL,
    ordered_at timestamp without time zone DEFAULT now() NOT NULL,
    due_date timestamp without time zone,
    returned_at timestamp without time zone
);


--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    role public.role DEFAULT 'reader'::public.role NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: authors id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors ALTER COLUMN id SET DEFAULT nextval('public.authors_id_seq'::regclass);


--
-- Name: books id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.books ALTER COLUMN id SET DEFAULT nextval('public.books_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: authors; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.authors (id, name, bio) FROM stdin;
1	Фёдор Достоевский	Орыс жазушысы, психологиялық романдарымен танымал әлем классигі.
2	Лев Толстой	Орыс жазушысы, эпикалық романдарымен бүкіл әлемге танымал классик.
3	Габриэль Гарсиа Маркес	Колумбиялық жазушы, Нобель сыйлығының лауреаты, сиқырлы реализмнің шебері.
4	Джордж Оруэлл	Ағылшын жазушысы, антиутопиялық романдарымен бүкіл әлемге мәлім.
5	Франц Кафка	Чех жазушысы, абсурд пен экзистенциализм тақырыптарының белгілі өкілі.
6	Эрнест Хемингуэй	Американдық жазушы, Нобель сыйлығының лауреаты, айсберг стилінің атасы.
7	Альбер Камю	Француз жазушысы мен философы, абсурдизм ағымының негізін салушы.
8	Антуан де Сент-Экзюпери	Француз жазушысы, «Кішкентай ханзада» кітабының авторы.
9	Джейн Остин	Ағылшын жазушысы, романтикалық роман жанрының классигі.
10	Харпер Ли	Американдық жазушы, Пулитцер сыйлығының лауреаты.
11	Фёдор Достоевский	Орыс жазушысы, психологиялық романдарымен танымал әлем классигі.
12	Лев Толстой	Орыс жазушысы, эпикалық романдарымен бүкіл әлемге танымал классик.
13	Габриэль Гарсиа Маркес	Колумбиялық жазушы, Нобель сыйлығының лауреаты, сиқырлы реализмнің шебері.
14	Джордж Оруэлл	Ағылшын жазушысы, антиутопиялық романдарымен бүкіл әлемге мәлім.
15	Франц Кафка	Чех жазушысы, абсурд пен экзистенциализм тақырыптарының белгілі өкілі.
16	Эрнест Хемингуэй	Американдық жазушы, Нобель сыйлығының лауреаты, айсберг стилінің атасы.
17	Альбер Камю	Француз жазушысы мен философы, абсурдизм ағымының негізін салушы.
18	Антуан де Сент-Экзюпери	Француз жазушысы, «Кішкентай ханзада» кітабының авторы.
19	Джейн Остин	Ағылшын жазушысы, романтикалық роман жанрының классигі.
20	Харпер Ли	Американдық жазушы, Пулитцер сыйлығының лауреаты.
21	Михаил Булгаков	Орыс-кеңестік жазушы, драматург. Сатиралық шедеврлерімен танымал.
22	Владимир Набоков	Орыс-американдық жазушы, поэт және аудармашы. Стильдік шеберлігімен танымал.
23	Борис Пастернак	Орыс ақыны мен жазушысы, Нобель сыйлығының лауреаты.
24	Томас Манн	Неміс жазушысы, Нобель сыйлығының лауреаты, XX ғасыр прозасының алыбы.
25	Вирджиния Вулф	Ағылшын жазушысы мен эссеист, модернизм ағымының жарқын өкілі.
26	Гюстав Флобер	Француз реализмінің атасы, стильге деген икемділігімен атақты жазушы.
27	Виктор Гюго	Француз жазушысы мен ақыны, романтизм дәуірінің ұлы өкілі.
28	Фрэнсис Скотт Фицджеральд	Американдық жазушы, «Джаз дәуірі» атанған 1920-жылдардың дауысы.
29	Джон Стейнбек	Американдық жазушы, Нобель сыйлығының лауреаты, әлеуметтік реализм шебері.
30	Чарльз Диккенс	Ағылшын жазушысы, Виктория дәуірінің ең танымал прозашысы.
31	Антон Чехов	Орыс жазушысы мен драматургі, қысқа әңгіме жанрының классигі.
32	Николай Гоголь	Орыс жазушысы мен драматургі, орыс әдебиетінің негізін қалаушылардың бірі.
33	Иван Тургенев	Орыс жазушысы, «нигилизм» ұғымын танымал еткен классик.
34	Симон де Бовуар	Француз экзистенциалист жазушысы мен философы, феминизм теориясының кейіпкері.
35	Джером Дэвид Сэлинджер	Американдық жазушы, жасөспірімдер психологиясын суреттеген шедеврлерімен танымал.
36	Эдгар Аллан По	Американдық жазушы мен ақын, детектив жанры мен қорқынышты әдебиеттің атасы.
37	Жюль Верн	Француз жазушысы, ғылыми-фантастика жанрының атасы.
38	Мигель де Сервантес	Испан жазушысы, «Дон Кихот» — дүниежүзілік әдебиеттің алғашқы заманауи романы.
\.


--
-- Data for Name: books; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.books (id, title_kz, author_id, category_id, isbn, year, total_copies, available_copies, cover_url, description_kz) FROM stdin;
1	Қылмыс пен жаза	1	1	1545160694	1866	5	5	https://covers.openlibrary.org/b/id/14911181-L.jpg	Студент Раскольников кісі өлтіргеннен кейін психологиялық азапты бастан өткізеді. Достоевскийдің ең ұлы туындыларының бірі.
2	Карамазов бауырлар	1	4	9780394604152	1880	4	4	https://covers.openlibrary.org/b/id/8272336-L.jpg	Достоевскийдің соңғы ұлы туындысы — от, сенім және адам табиғаты туралы терең философиялық роман.
3	Соғыс және бейбітшілік	2	1	9781566190275	1864	6	6	https://covers.openlibrary.org/b/id/12621906-L.jpg	Наполеон соғысы дәуіріндегі орыс қоғамын суреттейтін, ұрпақтан ұрпаққа жеткен ұлы эпопея.
4	Анна Каренина	2	1	1973998882	1876	5	5	https://covers.openlibrary.org/b/id/2560652-L.jpg	Махаббат, намыс және қоғам нормалары туралы Толстойдың ұлы трагедиялық романы.
5	Жалғыздықтың жүз жылы	3	1	9755101586	1967	4	4	https://covers.openlibrary.org/b/id/12627383-L.jpg	Буэндиа әулетінің жеті буын тарихын баяндайтын сиқырлы реализм шедеврі.
6	Мық тоғыз жүз сексен төрт	4	2	1401403514	2002	5	5	https://covers.openlibrary.org/b/id/8721590-L.jpg	Тоталитарлық режим туралы ең ықпалды антиутопиялық роман. "Үлкен аға сені бақылайды".
7	Жануарлар қожалығы	4	1	9781097268405	1945	4	4	https://covers.openlibrary.org/b/id/11261770-L.jpg	Саяси сатира ретінде жазылған аллегориялық шығарма — тоталитаризмді жануарлар бейнесінде сынайды.
8	Айналу	5	1	9798730685925	1915	3	3	https://covers.openlibrary.org/b/id/12820198-L.jpg	Бір таңертең жәндікке айналып кеткен Грегор Замзаның трагикалық оқиғасы.
9	Қарт және теңіз	6	1	1411403770	2008	4	4	https://covers.openlibrary.org/b/id/14344172-L.jpg	Кәрі балықшы Сантьягоның алып балықпен жекпе-жегін суреттейтін Нобель сыйлығын әперген шығарма.
10	Бөтен адам	7	4	9788422687375	1942	3	3	https://covers.openlibrary.org/b/id/13151269-L.jpg	Абсурдизм мен экзистенциализмнің символы болған Мерсоның жатсыну тарихы.
11	Кішкентай ханзада	8	8	9789754769869	1943	6	6	https://covers.openlibrary.org/b/id/10708272-L.jpg	Барлық жастағы оқырмандарға арналған философиялық ертегі — махаббат, достық және жоғалу туралы.
12	Мақтаныш пен алалық	9	1	1586633651	2002	4	4	https://covers.openlibrary.org/b/id/853465-L.jpg	Элизабет Беннет пен Дарси мырзаның махаббат тарихы — ағылшын классикасының шедеврі.
13	Сайрауықты өлтірме	10	1	9781560778479	2007	5	5	https://covers.openlibrary.org/b/id/12784310-L.jpg	Нәсілдік теңсіздік пен балалық қауымдастық тарихын суреттейтін Пулитцер сыйлықты роман.
14	Ақымақ	1	1	274273645X	1880	3	3	https://covers.openlibrary.org/b/id/9412225-L.jpg	Мейірімді де кіршіксіз ханзада Мышкиннің орыс қоғамымен қақтығысы.
15	Сизиф туралы миф	7	4	9788466356145	1941	2	2	https://covers.openlibrary.org/b/id/1014395-L.jpg	Адам өмірінің мағынасы мен абсурды туралы Камюдің негізгі философиялық эссесі.
16	Сезім мен сезімталдық	9	1	1481077848	1811	3	3	https://covers.openlibrary.org/b/id/9278292-L.jpg	Эллинор мен Марианнаның тағдыры арқылы сезім мен парасаттың тартысын суреттейтін роман.
17	Тырысқақ кезіндегі махаббат	3	1	8483467313	1985	3	3	https://covers.openlibrary.org/b/id/10096404-L.jpg	Флорентино Арисаның жиырма жылы асқан шыдамды, кемеңгер сүйіспеншілік тарихы.
18	Күн де шығады	6	1	9798621394370	1926	4	4	https://covers.openlibrary.org/b/id/78741-L.jpg	Жоғалған ұрпақтың Париж бен Памплонадағы тіршілігін суреттейтін Хемингуэйдің бірінші романы.
19	Сот	5	1	9780435385019	1825	3	3	https://covers.openlibrary.org/b/id/997423-L.jpg	Иосиф К. белгісіз айыппен сотталатын — кафкалық абсурд пен бюрократия туралы ерекше роман.
20	Мерекелі той	6	1	9788432200991	1964	2	2	https://covers.openlibrary.org/b/id/7268728-L.jpg	Хемингуэйдің 1920-жылдардағы Парижіндегі өмірін суреттейтін мемуарлық шедевр.
21	Қылмыс пен жаза	11	9	1545160694	1866	5	5	https://covers.openlibrary.org/b/id/14911181-L.jpg	Студент Раскольников кісі өлтіргеннен кейін психологиялық азапты бастан өткізеді. Достоевскийдің ең ұлы туындыларының бірі.
22	Карамазов бауырлар	11	12	9780394604152	1880	4	4	https://covers.openlibrary.org/b/id/8272336-L.jpg	Достоевскийдің соңғы ұлы туындысы — от, сенім және адам табиғаты туралы терең философиялық роман.
23	Соғыс және бейбітшілік	12	9	9781566190275	1864	6	6	https://covers.openlibrary.org/b/id/12621906-L.jpg	Наполеон соғысы дәуіріндегі орыс қоғамын суреттейтін, ұрпақтан ұрпаққа жеткен ұлы эпопея.
24	Анна Каренина	12	9	1973998882	1876	5	5	https://covers.openlibrary.org/b/id/2560652-L.jpg	Махаббат, намыс және қоғам нормалары туралы Толстойдың ұлы трагедиялық романы.
25	Жалғыздықтың жүз жылы	13	9	9755101586	1967	4	4	https://covers.openlibrary.org/b/id/12627383-L.jpg	Буэндиа әулетінің жеті буын тарихын баяндайтын сиқырлы реализм шедеврі.
26	Мың тоғыз жүз сексен төрт	14	10	1401403514	2002	5	5	https://covers.openlibrary.org/b/id/8721590-L.jpg	Тоталитарлық режим туралы ең ықпалды антиутопиялық роман. "Үлкен аға сені бақылайды".
27	Жануарлар қожалығы	14	9	9781097268405	1945	4	4	https://covers.openlibrary.org/b/id/11261770-L.jpg	Саяси сатира ретінде жазылған аллегориялық шығарма — тоталитаризмді жануарлар бейнесінде сынайды.
28	Айналу	15	9	9798730685925	1915	3	3	https://covers.openlibrary.org/b/id/12820198-L.jpg	Бір таңертең жәндікке айналып кеткен Грегор Замзаның трагикалық оқиғасы.
30	Бөтен адам	17	12	9788422687375	1942	3	3	https://covers.openlibrary.org/b/id/13151269-L.jpg	Абсурдизм мен экзистенциализмнің символы болған Мерсоның жатсыну тарихы.
31	Кішкентай ханзада	18	16	9789754769869	1943	6	6	https://covers.openlibrary.org/b/id/10708272-L.jpg	Барлық жастағы оқырмандарға арналған философиялық ертегі — махаббат, достық және жоғалу туралы.
32	Мақтаныш пен алалық	19	9	1586633651	2002	4	4	https://covers.openlibrary.org/b/id/853465-L.jpg	Элизабет Беннет пен Дарси мырзаның махаббат тарихы — ағылшын классикасының шедеврі.
33	Сайрауықты өлтірме	20	9	9781560778479	2007	5	5	https://covers.openlibrary.org/b/id/12784310-L.jpg	Нәсілдік теңсіздік пен балалық қауымдастық тарихын суреттейтін Пулитцер сыйлықты роман.
34	Ақымақ	11	9	274273645X	1880	3	3	https://covers.openlibrary.org/b/id/9412225-L.jpg	Мейірімді де кіршіксіз ханзада Мышкиннің орыс қоғамымен қақтығысы.
35	Сизиф туралы миф	17	12	9788466356145	1941	2	2	https://covers.openlibrary.org/b/id/1014395-L.jpg	Адам өмірінің мағынасы мен абсурды туралы Камюдің негізгі философиялық эссесі.
36	Сезім мен сезімталдық	19	9	1481077848	1811	3	3	https://covers.openlibrary.org/b/id/9278292-L.jpg	Эллинор мен Марианнаның тағдыры арқылы сезім мен парасаттың тартысын суреттейтін роман.
37	Тырысқақ кезіндегі махаббат	13	9	8483467313	1985	3	3	https://covers.openlibrary.org/b/id/10096404-L.jpg	Флорентино Арисаның жиырма жылы асқан шыдамды, кемеңгер сүйіспеншілік тарихы.
38	Күн де шығады	16	9	9798621394370	1926	4	4	https://covers.openlibrary.org/b/id/78741-L.jpg	Жоғалған ұрпақтың Париж бен Памплонадағы тіршілігін суреттейтін Хемингуэйдің бірінші романы.
39	Сот	15	9	9780435385019	1825	3	3	https://covers.openlibrary.org/b/id/997423-L.jpg	Иосиф К. белгісіз айыппен сотталатын — кафкалық абсурд пен бюрократия туралы ерекше роман.
40	Мерекелі той	16	9	9788432200991	1964	2	2	https://covers.openlibrary.org/b/id/7268728-L.jpg	Хемингуэйдің 1920-жылдардағы Парижіндегі өмірін суреттейтін мемуарлық шедевр.
41	Шебер мен Маргарита	21	\N	9788804342816	1966	5	5	https://covers.openlibrary.org/b/id/12947486-L.jpg	Мәскеуде пайда болған Сатана мен оның жолдастарының фантасмагориялық оқиғасы — ізгілік пен зұлымдық туралы ұлы роман.
42	Лолита	22	9	0297858807	1777	3	3	https://covers.openlibrary.org/b/id/12984540-L.jpg	Набоковтың ең даулы және кекесінді шығармасы — тіл шебері мен моралдық күрделіліктің мысалы.
43	Доктор Живаго	23	9	9788433911575	1957	4	4	https://covers.openlibrary.org/b/id/1045432-L.jpg	Революция мен азамат соғысы кезіндегі махаббат пен шығармашылық туралы эпикалық роман.
44	Сиқырлы тау	24	9	9783103481280	1924	3	3	https://covers.openlibrary.org/b/id/2056242-L.jpg	Швейцариялық санаторийде жеті жыл өткізген Ганс Касторптың өмірі арқылы Еуропа мәдениеті мен ақыл-ойының панорамасы.
45	Мисс Дэллоуэй	25	9	9783100925855	1925	3	3	https://covers.openlibrary.org/b/id/6397580-L.jpg	Лондондағы бір күн ішінде болатын оқиға — сана ағымы техникасын шебер қолданған роман.
46	Мадам Бовари	26	9	9782735206278	1991	4	4	https://covers.openlibrary.org/b/id/8379199-L.jpg	Провинциялық дәрігердің өмірінен қиял іздеген Эмма Бовариның трагедиясы.
47	Зарлы адамдар	27	11	9781411469853	2014	5	5	https://covers.openlibrary.org/b/id/11012366-L.jpg	Жан Вальжанның Франция революциясы кезіндегі өкіну мен сатып алу жолы — тарихтағы ең ықпалды романдардың бірі.
48	Ұлы Гэтсби	28	9	9781411403093	2008	5	5	https://covers.openlibrary.org/b/id/8432032-L.jpg	Американдық арман, байлық пен адасу туралы Фицджеральдтың ұлы романы.
49	Тышқандар мен адамдар туралы	29	9	9782070360376	1937	4	4	https://covers.openlibrary.org/b/id/14319003-L.jpg	Ұлы депрессия кезіндегі Джордж пен Леннидің достық пен армандар туралы қозғалтқыш тарихы.
50	Екі қала тарихы	30	11	\N	1921	4	4	https://covers.openlibrary.org/b/id/8324308-L.jpg	Француз революциясы кезіндегі Лондон мен Париж аясында болатын интригалы тарихи роман.
51	Шие бағы	31	9	9780573697500	1918	3	3	https://covers.openlibrary.org/b/id/13420205-L.jpg	Орыс дворяндарының өз иелігінен айырылуын суреттейтін Чеховтың соңғы драмасы.
52	Өлі жандар	32	9	9781090101730	1942	3	3	https://covers.openlibrary.org/b/id/7496125-L.jpg	Чичиковтың «өлі жандарды» сатып алу алаяқтығы арқылы орыс қоғамын сатиралық суреттеген шедевр.
53	Аталар мен ұлдар	33	9	0140441476	1867	3	3	https://covers.openlibrary.org/b/id/8236420-L.jpg	XIX ғасырдағы орыс зиялыларының ескілік пен жаңалық арасындағы идеологиялық қақтығысы.
54	Екінші жыныс	34	12	0679420169	1949	3	3	https://covers.openlibrary.org/b/id/78169-L.jpg	Феминизм тарихындағы іргелі шығарма — «Әйел болып тумайды, әйел болып қалыптасады».
55	Қара бидайдағы аңшы	35	9	\N	\N	4	4	https://covers.openlibrary.org/b/id/10737898-L.jpg	Холден Колфилдтің Нью-Йоркте үш күн ішінде бастан кешіретін рухани дағдарысы.
56	Ақылды жүрек	36	15	9781719093194	1958	3	3	https://covers.openlibrary.org/b/id/11851436-L.jpg	Пораның жасырын жүрегі барған сайын өзінің сыпыра сезімтал кейіпкерін есінен тандырады.
57	Теңіз астында жиырма мың миль	37	10	9780881010855	1870	4	4	https://covers.openlibrary.org/b/id/6573517-L.jpg	Капитан Немо мен оның суасты қайығы «Наутилустың» тылсым теңіз сапары.
58	Оба	17	9	9798597740546	1942	4	4	https://covers.openlibrary.org/b/id/13151272-L.jpg	Оба індеті жайлаған қалада адамдардың тағдыры мен ерлігін суреттейтін экзистенциалдық роман.
59	Сарай	15	9	2080704281	1926	2	2	https://covers.openlibrary.org/b/id/12605605-L.jpg	К. атты геодезист ешқашан ене алмайтын Сарайға жетуге тырысады — бюрократия мен жатсынудың символды романы.
60	Дон Кихот	38	9	1411407318	2008	4	4	https://covers.openlibrary.org/b/id/12759312-L.jpg	Рыцарлық романдарды оқып есінен танған Дон Кихоттың шалжай және қозғалтқыш оқиғалары.
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (id, name_kz) FROM stdin;
1	Роман
2	Ғылыми-фантастика
3	Тарих
4	Философия
5	Поэзия
6	Психология
7	Детектив
8	Балалар
9	Роман
10	Ғылыми-фантастика
11	Тарих
12	Философия
13	Поэзия
14	Психология
15	Детектив
16	Балалар
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orders (id, user_id, book_id, status, ordered_at, due_date, returned_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, name, email, password_hash, role, created_at) FROM stdin;
1	Кітапхана Әкімшісі	admin@library.kz	$2b$10$LdAu6O5rjG4YW.kqMg48RulmWimnSQefLV/qOoeNxLHSHYr4omxWS	admin	2026-03-02 15:10:51.397675
2	Тест Оқырман	reader@library.kz	$2b$10$lPqv1qIl5CY8APfwzQg9tuVF9PAziRtVS1..YZXyRXvNFTgyDH/Yy	reader	2026-03-02 15:10:51.46462
\.


--
-- Name: authors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.authors_id_seq', 38, true);


--
-- Name: books_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.books_id_seq', 60, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_id_seq', 16, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.orders_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: authors authors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors
    ADD CONSTRAINT authors_pkey PRIMARY KEY (id);


--
-- Name: books books_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: books books_author_id_authors_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_author_id_authors_id_fk FOREIGN KEY (author_id) REFERENCES public.authors(id);


--
-- Name: books books_category_id_categories_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_category_id_categories_id_fk FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: orders orders_book_id_books_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_book_id_books_id_fk FOREIGN KEY (book_id) REFERENCES public.books(id);


--
-- Name: orders orders_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict up2A3PWxC6x9dx2MCoENBoFWMtSdm7cCIRBsGahD46YE1Awk2oFU4WwWwo2CufV

