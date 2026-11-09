// Architectural & Universal Design Standards, Spatial Principles, and Precedents
// Reference bases: Pravilnik RS 22/2015 & 10/2026, ISO 21542:2021, EN 17210:2021,
// DeafSpace Guidelines (Gallaudet University), Autism ASPECTSS™ Index (Magda Mostafa).

const t = (en, sr) => ({ en, sr });

export const SPATIAL_STANDARDS = [
  {
    id: 'rampa',
    article: 'čl. 7',
    regulation: 'Pravilnik RS 22/2015 i 10/2026',
    standard: 'ISO 21542 §10 / EN 17210 §9',
    title: t('Ramps and level changes', 'Rampe i savladavanje visinske razlike'),
    rules: [
      t('Maximum longitudinal slope is 5 % (1:20); exceptionally up to 8.3 % (1:12) for short flights up to 6 m.',
        'Maksimalni nagib je 5 % (1:20); izuzetno do 8,3 % (1:12) za kratke krakove dužine do 6 m.'),
      t('Maximum run of a single flight at 5 % is 9.0 m; at 8.3 % it is 6.0 m.',
        'Maksimalna dužina jednog kraka pri nagibu 5 % je 9,0 m; pri 8,3 % je 6,0 m.'),
      t('Landings between flights must be at least 150 cm long; corner landings must be at least 150 × 150 cm.',
        'Odmorišta (podesti) između krakova moraju biti dužine min. 150 cm; na prelomima min. 150 × 150 cm.'),
      t('Minimum clear width is 120 cm for one-way and 180 cm for two-way wheelchair traffic.',
        'Minimalna čista širina je 120 cm za jednosmerno i 180 cm za dvosmerno kretanje kolica.'),
      t('Continuous double handrails on both sides at heights of 70 cm and 90 cm, extending 30 cm beyond the flight.',
        'Dvostruki neprekidni rukohvati sa obe strane na visinama 70 cm i 90 cm, sa prepustom od 30 cm na krajevima.'),
      t('Protective wheel curb of at least 5 cm height along both exposed edges.',
        'Zaštitna ivična lajsna (ivičnjak) visine min. 5 cm duž obe otvorene strane rampe.'),
      t('Tactile warning paving 40–50 cm wide placed 50 cm before the start and end of the ramp.',
        'Taktilno polje upozorenja širine 40–50 cm postavljeno na 50 cm pre početka i kraja rampe.')
    ],
    visual: 'assets/vizuali/rampa-standard.svg'
  },
  {
    id: 'taktilne-staze',
    article: 'čl. 10',
    regulation: 'Pravilnik RS 22/2015 i 10/2026',
    standard: 'ISO 21542 §23 / CEN/TS 15209',
    title: t('Pedestrian surfaces and tactile paving', 'Pešačke površine i taktilne staze'),
    rules: [
      t('Tactile guide paths use longitudinal trapezoidal ribs (height 4–5 mm, width 25–35 mm) to guide white canes.',
        'Trake vođenja imaju uzdužna trapezna rebra (visine 4–5 mm, širine 25–35 mm) za usmeravanje belog štapa.'),
      t('Tactile warning fields use truncated domes (height 4–5 mm, base Ø 25–35 mm) to signal hazards or turns.',
        'Polja upozorenja imaju zarubljene kupe (visine 4–5 mm, baze Ø 25–35 mm) za najavu opasnosti, prelaza i skretanja.'),
      t('Standard path width is 40–60 cm. 90-degree directional changes require a 50 × 50 cm warning box.',
        'Širina taktilnih traka je 40–60 cm. Skretanje pod uglom 90° traži polje promene smera 50 × 50 cm.'),
      t('Luminance contrast between tactile paving and surrounding surface must achieve Delta LRV ≥ 30 points.',
        'Svetlosni kontrast između taktilne ploče i okolnog poda mora imati razliku Delta LRV ≥ 30 bodova.')
    ],
    visual: 'assets/vizuali/taktilne-staze.svg'
  },
  {
    id: 'hodnici',
    article: 'čl. 14',
    regulation: 'Pravilnik RS 22/2015 i 10/2026',
    standard: 'ISO 21542 §13 / EN 17210 §11',
    title: t('Corridors and circulation paths', 'Hodnici i horizontalne komunikacije'),
    rules: [
      t('Minimum clear corridor width is 120 cm for one-way traffic; local narrowing to 90 cm allowed up to 1.5 m length.',
        'Minimalna čista širina hodnika je 120 cm; lokalno suženje na 90 cm dozvoljeno je samo do dužine 1,5 m.'),
      t('Two-way wheelchair passing requires minimum 180 cm continuous clear width.',
        'Mimoilaženje dvoje kolica zahteva neprekidnu čistu širinu od najmanje 180 cm.'),
      t('Passing bays of 180 × 180 cm or turning circles Ø 150 cm must occur every 15 m in long corridors.',
        'Mesta za mimoilaženje 180 × 180 cm ili obrtni krugovi Ø 150 cm moraju postojati na svakih 15 m dužine.'),
      t('Clear overhead headroom along the path must be at least 220 cm (no low protruding obstacles).',
        'Slobodna visina prolaza duž trase mora biti najmanje 220 cm (bez isturenih prepreka u visini glave).')
    ],
    visual: 'assets/vizuali/manevarski-prostor.svg'
  },
  {
    id: 'vrata',
    article: 'čl. 17 i 18',
    regulation: 'Pravilnik RS 22/2015 i 10/2026',
    standard: 'ISO 21542 §14 / EN 17210 §12',
    title: t('Doors, approaches and thresholds', 'Vrata, prilazi i pragovi'),
    rules: [
      t('Minimum clear opening width is 90 cm (entrance doors recommended min. 100 cm).',
        'Minimalna svetla širina otvora vrata je 90 cm (preporučeno 100 cm za glavni ulaz).'),
      t('Maximum threshold height is 2.0 cm with rounded or chamfered edges.',
        'Maksimalna visina praga je 2,0 cm, sa obaveznim zaobljenim ili iskošenim ivicama.'),
      t('Door latch clearance on pull side must be at least 50 cm for lateral wheelchair approach.',
        'Slobodan prostor na zidu sa strane kvake (vučna strana) mora biti min. 50 cm za bočni prilaz kolicima.'),
      t('Lever-type door handles at height 90–100 cm; knob handles are strictly non-compliant.',
        'Polužne kvake na visini 90–100 cm; okrugle kugle/kvake koje traže stisak šake nisu usklađene.'),
      t('Operating force to open doors must not exceed 25–30 N; automatic sliding doors preferred.',
        'Sila potrebna za otvaranje vrata ne sme preći 25–30 N; preporučuju se automatska klizna vrata.')
    ],
    visual: 'assets/vizuali/manevarski-prostor.svg'
  },
  {
    id: 'manevarski-prostor',
    article: 'čl. 19',
    regulation: 'Pravilnik RS 22/2015 i 10/2026',
    standard: 'ISO 21542 §7 / EN 17210 §7',
    title: t('Manoeuvring space and turning circle', 'Manevarski prostor i obrtni krug'),
    rules: [
      t('Obstacle-free turning circle of diameter Ø 150 cm required at all decision points and destinations.',
        'Slobodan obrtni krug prečnika Ø 150 cm bez fiksnih prepreka obavezan je na svim odredištima i skretanjima.'),
      t('90-degree turn in a corridor requires at least 120 × 120 cm clear corner space.',
        'Skretanje pod pravim uglom od 90° u hodniku zahteva koridor dimenzija najmanje 120 × 120 cm.'),
      t('Under-desk or counter knee clearance must be at least 70 cm high, 80 cm wide and 50 cm deep.',
        'Slobodan prostor za kolena ispod pulta ili stola mora biti min. 70 cm visine, 80 cm širine i 50 cm dubine.')
    ],
    visual: 'assets/vizuali/manevarski-prostor.svg'
  },
  {
    id: 'toalet',
    article: 'čl. 25',
    regulation: 'Pravilnik RS 22/2015 i 10/2026',
    standard: 'ISO 21542 §21 / EN 17210 §16',
    title: t('Accessible toilet cabin', 'Pristupačni toalet'),
    rules: [
      t('Minimum cabin size is 150 × 150 cm; recommended size for comfort and bilateral transfer is 220 × 220 cm.',
        'Minimalne dimenzije kabine su 150 × 150 cm; preporučeno za pun komfor i obostrani transfer je 220 × 220 cm.'),
      t('Door clear width ≥ 90 cm opening outward with an internal horizontal pull bar at 85–90 cm.',
        'Vrata svetle širine ≥ 90 cm sa otvaranjem ka spolja i horizontalnom ručkom sa unutrašnje strane na 85–90 cm.'),
      t('Toilet bowl centerline 40–45 cm from wall; seat height 45–48 cm; projection from back wall 70 cm.',
        'Osa WC šolje na 40–45 cm od bočnog zida; visina sedišta 45–48 cm; dubina od zadnjeg zida 70 cm.'),
      t('Free lateral transfer space beside the bowl must be at least 90 cm.',
        'Slobodan prostor pored WC šolje za bočni transfer iz kolica mora biti najmanje 90 cm.'),
      t('One fixed wall grab bar and one drop-down folding grab bar on transfer side at height 75–80 cm.',
        'Jedan fiksni zidni rukohvat i jedan preklopni rukohvat na strani transfera na visini 75–80 cm.'),
      t('Washbasin top at 80–85 cm with clearance under basin ≥ 70 cm; mirror lower edge at ≤ 100 cm.',
        'Umivaonik na visini 80–85 cm sa slobodnim prostorom ispod ≥ 70 cm; donja ivica ogledala na ≤ 100 cm.'),
      t('Emergency SOS pull cord with two rings: one at 10–20 cm above floor and one at 80–100 cm.',
        'Uzica za poziv u pomoć sa dva prstena: jedan na 10–20 cm od poda (u slučaju pada) i drugi na 80–100 cm.')
    ],
    visual: 'assets/vizuali/pristupacni-toalet.svg'
  }
];

export const SEVEN_PRINCIPLES = [
  {
    n: 1,
    title: t('Equitable Use', 'Ravnopravna upotreba'),
    definition: t('The design is useful and marketable to people with diverse abilities. Provide the same means of use for all users: identical whenever possible, equivalent when not. Avoid segregating or stigmatising any users.',
      'Dizajn je koristan i privlačan za ljude različitih sposobnosti. Obezbediti isti način upotrebe za sve: identičan kad god je moguće, ekvivalentan kada nije. Izbeći segregaciju i žigosanje bilo kog korisnika.'),
    rule: t('No separate "accessible" back entrance. The main architectural promenade must welcome all bodies.',
      'Bez odvojenog „invalidskog” sporednog ulaza. Glavna arhitektonska promenada mora primiti svako telo.'),
    fail: t('Stairs at the front facade with a motorized lift or freight ramp hidden behind the garbage bins.',
      'Reprezentativno stepenište na glavnoj fasadi dok se rampa ili teretni lift kriju iza kontejnera za smeće.')
  },
  {
    n: 2,
    title: t('Flexibility in Use', 'Fleksibilnost u upotrebi'),
    definition: t('The design accommodates a wide range of individual preferences and abilities. Provide choice in methods of use. Accommodate right- or left-handed access and facilitate user accuracy and pace.',
      'Dizajn odgovara širokom rasponu individualnih navika i sposobnosti. Pružiti izbor metoda korišćenja. Prilagoditi levorukim i desnorukim korisnicima i omogućiti kretanje sopstvenim tempom.'),
    rule: t('Bilateral transfer options in toilets; alternative paths of varying pace and gradient.',
      'Mogućnost obostranog transfera u toaletu; alternativne trase različitog ritma i nagiba na istoj relaciji.'),
    fail: t('Fixed furniture bolted down with only one rigid posture or single-handed access allowed.',
      'Fiksirani nameštaj ušrafljen za pod koji dozvoljava samo jedan položaj tela i samo desnoruku upotrebu.')
  },
  {
    n: 3,
    title: t('Simple and Intuitive Use', 'Jednostavna i intuitivna upotreba'),
    definition: t('Use of the design is easy to understand, regardless of user experience, knowledge, language skills, or current concentration level. Eliminate unnecessary complexity. Be consistent with intuition and expectations.',
      'Upotreba je lako razumljiva bez obzira na iskustvo, znanje, jezik ili nivo koncentracije korisnika. Ukloniti nepotrebnu složenost. Biti u skladu sa intuicijom i prostornim očekivanjima.'),
    rule: t('Wayfinding derived from architectural geometry, natural daylight and material transitions, not excessive signage.',
      'Orijentacija u prostoru izvedena iz geometrije zgrade, dnevnog svetla i materijala, a ne iz pretrpanih tabli sa natpisima.'),
    fail: t('Labyrinths where finding the toilet or exit requires reading multiple convoluted signs.',
      'Lavirintski hodnici u kojima je za nalaženje toaleta ili izlaza potrebno dešifrovati gomilu nejasnih strelica.')
  },
  {
    n: 4,
    title: t('Perceptible Information', 'Uočljive informacije'),
    definition: t('The design communicates necessary information effectively to the user, regardless of ambient conditions or sensory abilities. Use different modes (pictorial, verbal, tactile) for redundant presentation of essential information.',
      'Dizajn efikasno saopštava neophodne informacije bez obzira na okolne uslove ili čulne sposobnosti. Koristiti različite medijume (vizuelne, verbalne, taktilne) za višestruku najavu ključnih tačaka.'),
    rule: t('Every visual sign has a raised tactile and Braille counterpart; acoustic alarms paired with flashing beacons.',
      'Svaka vizuelna oznaka ima reljefni i Brajev par; zvučni alarm uvek prati vizuelni svetlosni signal (stroboskop).'),
    fail: t('Announcements made solely via speaker public address or emergency alarms using only sirens without visual cues.',
      'Obaveštenja data samo preko razglasa ili evakuacioni alarm samo sa sirenom bez trepćućeg svetla.')
  },
  {
    n: 5,
    title: t('Tolerance for Error', 'Tolerancija na grešku'),
    definition: t('The design minimizes hazards and the adverse consequences of accidental or unintended actions. Arrange elements to minimize hazards: dangerous elements eliminated, isolated, or shielded. Provide fail-safe features.',
      'Dizajn smanjuje opasnosti i štetne posledice slučajnih ili nehotičnih radnji. Rasporediti elemente tako da se rizik ukloni, izoluje ili zaštiti. Obezbediti sigurnost pri otkazu.'),
    rule: t('Door edges without finger pinches; non-slip floor finishes (min R10/R11); stairs with contrasting closed risers.',
      'Vrata sa zaštitom od prignječenja prstiju; protivklizni podovi (min R10/R11); stepenice sa punim čelom i kontrastnim ivicama.'),
    fail: t('Open risers on stairs where a cane or foot can slip through; glass partitions without high-contrast visual markings.',
      'Stepeništa sa otvorenim čelima gde štap ili stopalo propada; staklene pregrade bez kontrastnih traka u visini očiju.')
  },
  {
    n: 6,
    title: t('Low Physical Effort', 'Nizak fizički napor'),
    definition: t('The design can be used efficiently and comfortably and with a minimum of fatigue. Allow user to maintain a neutral body position. Use reasonable operating forces. Minimize repetitive actions and sustained physical effort.',
      'Dizajn se koristi efikasno i udobno uz minimalan zamor. Omogućiti neutralan položaj tela. Koristiti umerene radne sile. Smanjiti ponavljane radnje i dugotrajan fizički napor.'),
    rule: t('Gentle slopes (≤ 5 %) with frequent rest benches; light door closers (≤ 25 N) or sensor-driven sliding doors.',
      'Blagi nagibi (≤ 5 %) sa čestim klupama za predah; laka vrata (otvaranje snagom do 25 N) ili automatska klizna vrata.'),
    fail: t('Heavy self-closing fire doors requiring strong pushing force; long steep slopes without intermediate landings.',
      'Teška vrata sa prenapregnutim pumpama koja traže jak potisak; duge strme staze bez ijednog ravnog podesta.')
  },
  {
    n: 7,
    title: t('Size and Space for Approach and Use', 'Veličina i prostor za prilaz i upotrebu'),
    definition: t('Appropriate size and space is provided for approach, reach, manipulation, and use regardless of user’s body size, posture, or mobility. Provide clear line of sight to important elements for any seated or standing user.',
      'Obezbeđeni su odgovarajuća veličina i prostor za prilaz, doseg, rukovanje i upotrebu bez obzira na građu, položaj tela ili pokretljivost. Obezbediti jasan vidik ka bitnim elementima i sedećim i stojećim osobama.'),
    rule: t('Controls and counters placed in the comfortable 80–100 cm band; clear floor maneuvering zones at all fixtures.',
      'Tasteri, pultovi i ormarići u zoni dohvata 80–100 cm; slobodan manevarski prostor ispred svih elemenata.'),
    fail: t('Counters built at standing-only height 120 cm without a lowered 75–80 cm section with leg clearance.',
      'Pultovi na visini 120 cm bez spuštenog dela na 75–80 cm sa slobodnim prostorom za noge.')
  }
];

export const DEAFSPACE_PATTERNS = [
  {
    id: 'space-proximity',
    title: t('Space and Proximity', 'Prostor i blizina'),
    body: t('Signing in motion requires wider corridors: two individuals walking while communicating need 210–240 cm clear width to accommodate visual contact, peripheral vision and arm gestures.',
      'Znakovni razgovor u kretanju traži šire hodnike: dvoje ljudi u hodu treba 210–240 cm čiste širine radi vizuelnog kontakta, perifernog vida i zamaha ruku.')
  },
  {
    id: 'sensory-reach',
    title: t('Sensory Reach', 'Senzorni domet'),
    body: t('Extending the sensory envelope through spatial transparency: curved corners, glazed alcoves and wide viewing angles eliminate blind collisions and extend spatial awareness.',
      'Širenje čulnog dometa kroz prostornu transparentnost: zakrivljeni uglovi, staklene niše i široki vidni uglovi uklanjaju slepe sudare i šire svest o prostoru.')
  },
  {
    id: 'mobility-proximity',
    title: t('Mobility and Proximity', 'Kretanje i blizina'),
    body: t('Automatic sliding doors on sensor control allow entering and exiting rooms without dropping hands from conversation. Level floor transitions prevent tripping while maintaining eye contact.',
      'Automatska klizna vrata na senzor omogućavaju ulazak i izlazak bez prekidanja razgovora rukama. Ravni podovi sprečavaju spoticanje tokom očnog kontakta.')
  },
  {
    id: 'light-color',
    title: t('Light and Color', 'Svetlo i boja'),
    body: t('Diffuse, glare-free illumination without sharp shadows. Backlighting behind speakers is strictly avoided to prevent facial silhouettes that hinder lip-reading and sign recognition.',
      'Difuzno osvetljenje bez bleštanja i oštrih senki. Kontrasvetlo iza leđa sagovornika strogo se izbegava jer stvara siluete koje ometaju čitanje sa usana i znakovni govor.')
  },
  {
    id: 'acoustics',
    title: t('Acoustics', 'Akustika'),
    body: t('Vibrations from HVAC mechanical systems and high reverberation severely disorient cochlear implant and hearing aid users. Reverberation time RT60 must be damped below 0.60 s.',
      'Mehaničke vibracije ventilacije i jak odjek dezorijentišu korisnike kohlearnih implantata i slušnih aparata. Vreme reverberacije RT60 mora biti prigušeno ispod 0,60 s.')
  }
];

export const ASPECTSS_INDEX = [
  {
    letter: 'A',
    key: 'Acoustics',
    title: t('Acoustical Control', 'Akustička kontrola'),
    body: t('Sound absorption to minimize echoes and background noise, keeping sensory load within manageable thresholds for neurodivergent and sensory-sensitive users.',
      'Zvučna apsorpcija radi smanjenja odjeka i pozadinske buke, čime se senzorno opterećenje drži pod kontrolom.')
  },
  {
    letter: 'S',
    key: 'Spatial Sequencing',
    title: t('Spatial Sequencing', 'Prostorni redosled'),
    body: t('Logical, predictable one-way or clearly choreographed spatial transitions from high-stimulus public spaces to quiet low-stimulus environments.',
      'Logičan, predvidljiv sled prostora koji vodi od javnih zona visoke stimulacije ka mirnim zonama niskog opterećenja.')
  },
  {
    letter: 'P',
    key: 'Escape Spaces',
    title: t('Escape Spaces', 'Prostori za povlačenje'),
    body: t('Small, quiet refuges or built-in alcoves adjacent to circulation where a user can temporarily withdraw from sensory overload while feeling safe.',
      'Mala, mirna skloništa ili niše uz glavne tokove kretanja gde korisnik može privremeno da se povuče od senzornog preopterećenja.')
  },
  {
    letter: 'E',
    key: 'Compartmentalization',
    title: t('Compartmentalization', 'Funkcionalno razgraničenje'),
    body: t('Clear spatial boundaries for each activity: rooms with single, unambiguous purposes reduce visual distraction and cognitive friction.',
      'Jasne prostorne granice za svaku aktivnost: prostorije sa jednom nedvosmislenom namenom smanjuju ometanje pažnje.')
  },
  {
    letter: 'C',
    key: 'Transition Zones',
    title: t('Transition Zones', 'Prelazne zone'),
    body: t('Sensory airlocks or anterooms that calibrate sensory conditions (lighting, volume, smell) between contrasting areas before entry.',
      'Senzorne pretkomore koje postepeno usklađuju uslove (svetlo, zvuk, miris) između različitih prostora pre ulaska.')
  },
  {
    letter: 'T',
    key: 'Sensory Zoning',
    title: t('Sensory Zoning', 'Senzorno zoniranje'),
    body: t('Grouping spaces into high-stimulus zones (sports, music, crafts) and low-stimulus zones (reading, resting, focus) separated by buffers.',
      'Grupisanje prostora u visoko-stimulativne (pokret, muzika, buka) i nisko-stimulativne (čitanje, predah, fokus) odvojene tampon-zonama.')
  },
  {
    letter: 'S',
    key: 'Safety',
    title: t('Safety', 'Sigurnost i predvidljivost'),
    body: t('Rounded edges, tempered glass, non-toxic finishes, tamper-proof fixtures and predictable environments that eliminate surprise hazards.',
      'Zaobljene ivice, kaljeno staklo, netoksični materijali i predvidljivo okruženje bez iznenadnih fizičkih rizika.')
  }
];

export const PRECEDENTS = [
  {
    id: 'ed-roberts-campus',
    title: t('Ed Roberts Campus', 'Ed Roberts Campus'),
    location: 'Berkeley, California, USA',
    architect: 'Leddy Maytum Stacy Architects',
    year: '2011',
    category: t('Public & Community', 'Javni i društveni objekat'),
    hero: t('Monumental spiral ramp as primary spatial sculpture and civic celebration of universal access.',
      'Monumentalna spiralna rampa kao primarna prostorna skulptura i javno slavljenje univerzalnog pristupa.'),
    measured: [
      t('Central ramp slope: 5 % (1:20) continuous with horizontal rest segments', 'Nagib centralne rampe: neprekidnih 5 % (1:20) sa horizontalnim odmorištima'),
      t('Ramp width: 213 cm clear passage allowing two powered wheelchairs to pass', 'Širina rampe: 213 cm slobodnog prolaza za nesmetano mimoilaženje dvoje elektromotornih kolica'),
      t('Acoustic finish: perforated timber acoustic panels achieving RT60 < 0.5 s in atrium', 'Akustika: perforirani drveni apsorpcioni paneli koji drže RT60 < 0,5 s u atrijumu'),
      t('Air quality: 100 % outside air economizer cycle with zero-VOC finishes for environmental sensitivities', 'Kvalitet vazduha: 100 % svež vazduh bez VOC isparenja za osobe sa hemijskim osetljivostima')
    ],
    lesson: t('The ramp is not a secondary accommodation hidden in the back: it is the central architectural experience for everyone entering from the transit station.',
      'Rampa nije sekundarno prilagođavanje sakriveno pozadi: ona je centralni arhitektonski doživljaj za svakoga ko ulazi iz metro stanice.')
  },
  {
    id: 'helsinki-oodi',
    title: t('Helsinki Central Library Oodi', 'Gradska biblioteka Oodi'),
    location: 'Helsinki, Finland',
    architect: 'ALA Architects',
    year: '2018',
    category: t('Civic & Educational', 'Javna biblioteka i kulturni centar'),
    hero: t('Step-free open architecture with zenithal daylight and tripartite acoustic zoning.',
      'Otvorena arhitektura bez pragova sa zenitalnim svetlom i trodelnim akustičkim zoniranjem.'),
    measured: [
      t('Zero threshold transitions across 17,000 m² public floor area', '0 cm pragova na celoj javnoj površini od 17.000 m²'),
      t('Zenithal lighting: circular roof skylights providing shadowless diffuse reading light', 'Zenitalno svetlo: kružne krovne lanterne daju meko difuzno svetlo bez oštrih senki'),
      t('Three acoustic zones: active civic ground floor, noisy collaborative workshops middle, silent sanctuary top', 'Tri akustičke zone: aktivno prizemlje, bučne radionice na spratu, mirna oaza na vrhu')
    ],
    lesson: t('Universal design is civic hospitality: making an entire city living room equally dignified for all generations.',
      'Univerzalni dizajn kao građansko gostoprimstvo: celokupna gradska dnevna soba jednako dostojanstvena za sve generacije.')
  },
  {
    id: 'gallaudet-sorensen',
    title: t('Sorensen Center, Gallaudet University', 'Sorensen centar, Gallaudet'),
    location: 'Washington, D.C., USA',
    architect: 'SmithGroup',
    year: '2008',
    category: t('Higher Education', 'Univerzitetski objekat'),
    hero: t('First building specifically designed around the five dimensions of DeafSpace.',
      'Prva zgrada namenski projektovana oko pet dimenzija DeafSpace-a.'),
    measured: [
      t('Circulation corridors: 240 cm wide for comfortable sign-language walking conversation', 'Hodnici širine 240 cm za nesmetan znakovni razgovor dvoje ljudi u hodu'),
      t('Automatic sliding pocket doors on sensor loops across all seminar and meeting rooms', 'Automatska klizna vrata na senzorski pogon na svim učionicama i salama'),
      t('Lighting: non-glare diffuse indirect lighting with CRI > 90 for facial expression clarity', 'Osvetljenje: difuzno indirektno svetlo bez odsjaja sa CRI > 90 za jasnoću mimike lica')
    ],
    lesson: t('When physical boundaries accommodate the visual and tactile rhythm of communication, cognitive fatigue drops measurably.',
      'Kada fizički prostor prati vizuelni i taktilni ritam komunikacije, kognitivni zamor merljivo opada.')
  },
  {
    id: 'acropolis-museum',
    title: t('Acropolis Museum', 'Muzej Akropolja'),
    location: 'Athens, Greece',
    architect: 'Bernard Tschumi Architects',
    year: '2009',
    category: t('Museum & Culture', 'Muzej i arheologija'),
    hero: t('Ascending archaeological landscape unified through gentle glass ramps with ceramic frits.',
      'Uspon kroz arheološki pejzaž objedinjen blagim staklenim rampama sa keramičkim tačkastim rasterom.'),
    measured: [
      t('Internal ramp slope: 4.8 % (1:21) ascending over active excavation pits', 'Nagib unutrašnje rampe: 4,8 % (1:21) u usponu iznad arheoloških iskopina'),
      t('Non-slip ceramic frit pattern on structural glass floor: certified R11 rating', 'Keramički raster protiv klizanja na staklenom podu: sertifikovana R11 ocena'),
      t('1:1 tactile marble replicas and tactile orientation plans with Braille signage at each landing', 'Taktilni modeli skulptura 1:1 i reljefni planovi kretanja sa Brajevim pismom na podestima')
    ],
    lesson: t('Overcoming steep terrain can become the dramatic core of architectural narrative rather than a technical compromise.',
      'Savladavanje visine može postati dramaturško jezgro arhitektonske priče, a ne tehnički kompromis.')
  },
  {
    id: 'hazelwood-school',
    title: t('Hazelwood School for the Multiple Sensory Impaired', 'Škola Hazelwood za višestruko oštećenje čula'),
    location: 'Glasgow, Scotland, UK',
    architect: 'Alan Dunlop Architect',
    year: '2007',
    category: t('Specialised Education', 'Specijalizovana škola'),
    hero: t('Curved natural cork trail wall providing continuous tactile guidance for dual sensory impaired children.',
      'Zakrivljeni taktilni zid od prirodne plute koji pruža neprekidno vođenje za decu oštećenog vida i sluha.'),
    measured: [
      t('Continuous tactile wall with relief signage at handrail height (80 cm) and head height (150 cm)', 'Neprekidni taktilni zid sa reljefnim oznakama na visini rukohvata (80 cm) i glave (150 cm)'),
      t('Natural cork clad finish providing acoustic damping (RT60 < 0.4 s) and tactile warmth', 'Obloga od prirodne plute: visoko akustičko prigušenje (RT60 < 0,4 s) i prijatna taktilna toplota'),
      t('Step-free single-storey plan with rooflights delivering glare-free north-facing natural illumination', 'Prizemni plan bez stepenika sa krovnim lanternama za severno svetlo bez bleštanja')
    ],
    lesson: t('The wall itself acts as wayfinding instrument: tactile architecture replaces floor barriers.',
      'Sam zid postaje instrument orijentacije: taktilna arhitektura zamenjuje prepreke na podu.')
  },
  {
    id: 'msub-beograd',
    title: t('Museum of Contemporary Art (MSUB)', 'Muzej savremene umetnosti (MSUB)'),
    location: 'Belgrade, Serbia',
    architect: 'Ivan Antić & Ivanka Raspopović (1965; adaptacija 2017)',
    year: '1965 / 2017',
    category: t('Museum & Heritage', 'Muzej i arhitektonsko nasleđe'),
    hero: t('Integrating universal circulation into modern cascading split-level architecture without compromising monumentality.',
      'Integracija pristupačnosti u modernističko kaskadno nasleđe polu-nivoa bez narušavanja antologijskog prostora.'),
    measured: [
      t('6 split-level galleries connected by new discreet glass hydraulic lift and ramp links', '6 kaskadnih polu-nivoa povezanih transparentnim hidrauličnim liftom i rampama'),
      t('Ramp gradients adapted to interior steps with brushed stainless steel double handrails', 'Nagibi unutrašnjih rampi prilagođeni nivoima uz dvostruke rukohvate od nerđajućeg čelika'),
      t('Zero-threshold floor transitions between gallery halls', 'Ravni prelazi bez pragova između izložbenih celina')
    ],
    lesson: t('Architectural heritage can be made fully accessible without destructive interventions when the circulation geometry respects the original logic.',
      'Arhitektonsko nasleđe može postati pristupačno bez agresivnih poteza kada geometrija kretanja prati logiku originala.')
  }
];

export const VISUAL_ATLAS = [
  {
    id: 'manevarski-prostor',
    title: t('Wheelchair Dimensions & Turning Circle Ø150 cm', 'Antropometrija kolica i obrtni krug Ø 150 cm'),
    file: 'assets/vizuali/manevarski-prostor.svg',
    summary: t('Footprint (70 × 120 cm), reach zones (40–120 cm), turning circle Ø 150 cm (Art. 19), corridor passing widths (120, 150, 180 cm).',
      'Gabarit kolica (70 × 120 cm), zone dohvata (40–120 cm), obrtni krug Ø 150 cm (čl. 19), širine hodnika i mimoilaženje (120, 150, 180 cm).')
  },
  {
    id: 'rampa-standard',
    title: t('Ramp Profile & Plan Standards', 'Podužni presek i osnova rampe po čl. 7'),
    file: 'assets/vizuali/rampa-standard.svg',
    summary: t('5 % standard vs 8.3 % exception, landing min. 150 cm, double handrails at 70/90 cm with 30 cm returns, 5 cm curb, tactile strip.',
      'Nagib 5 % redovan vs 8,3 % izuzetak, odmorište min. 150 cm, dvostruki rukohvat na 70/90 cm sa prepustom 30 cm, ivičnjak 5 cm, taktilna traka.')
  },
  {
    id: 'pristupacni-toalet',
    title: t('Accessible Sanitary Cabin Layout', 'Pristupačni toalet po čl. 25'),
    file: 'assets/vizuali/pristupacni-toalet.svg',
    summary: t('Cabin 150 × 150 cm min / 220 × 220 cm recommended, 90 cm lateral transfer, outward door, drop-down grab bars, knee clearance, SOS cord.',
      'Kabina 150 × 150 cm min / 220 × 220 cm preporučeno, bočni transfer 90 cm, vrata ka spolja, preklopni rukohvati, prostor za kolena, SOS uzica.')
  },
  {
    id: 'taktilne-staze',
    title: t('Tactile Guiding & Warning Paving', 'Taktilne trake vođenja i polja upozorenja po čl. 10'),
    file: 'assets/vizuali/taktilne-staze.svg',
    summary: t('Guiding ribs vs truncated blisters, 4–5 mm profiles, 40–60 cm path widths, Delta LRV ≥ 30 luminance contrast rules.',
      'Trake vođenja (uzdužna rebra) vs polja upozorenja (zarubljene kupe), profil 4–5 mm, širine 40–60 cm, pravilo kontrasta Delta LRV ≥ 30.')
  },
  {
    id: 'deafspace-geometrija',
    title: t('DeafSpace Geometry & Corridors', 'DeafSpace arhitektonska geometrija'),
    file: 'assets/vizuali/deafspace-geometrija.svg',
    summary: t('240 cm corridor for signing in motion vs 120 cm standard, 180–200° visual awareness, horseshoe seating, diffuse illumination.',
      'Hodnik 240 cm za razgovor u hodu naspram standardnih 120 cm, vidno polje 180–200°, potkovičasto sedenje, difuzno osvetljenje.')
  }
];
