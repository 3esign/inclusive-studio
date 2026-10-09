// Exercise bank. Each exercise names the week it belongs to, what is handed in, how it is checked,
// and the source it comes from. Sources were read on 2026-10-01; see docs/research-roadmap.md.
// `kind`: drawing | measurement | reading | fieldwork | participatory | digital | making

export const exercises = [
  {
    id: 'toy-for-coordination', week: 1, stage: 1, kind: 'making',
    title: { en: 'A toy that teaches space', sr: 'Igračka koja uči prostor' },
    task: { en: 'Day one, by hand. The association “Živimo zajedno” makes its own toys: a cardboard carton, bamboo skewers pushed through its walls, plastic bottle caps glued in pairs and threaded on the skewers so they slide and turn. Cost: waste. Design the next one. It must train two things at once — a movement of the hand (grip, both hands together, crossing the midline, aim) and an operation on space (match, rotate, order, fit, find the same shape from another side). Draw it so it can be built from what a household throws away, in one afternoon, by a parent who is not a maker.', sr: 'Prvi dan, rukom. Udruženje „Živimo zajedno” pravi svoje igračke: kartonska kutija, štapići za ražnjiće probodeni kroz njene stranice, plastični čepovi slepljeni u parove i nanizani na štapiće tako da klize i okreću se. Cena: otpad. Projektuj sledeću. Mora da vežba dve stvari odjednom — pokret ruke (hvat, obe ruke zajedno, prelazak srednje linije tela, nišanjenje) i radnju nad prostorom (uparivanje, rotiranje, ređanje, uklapanje, prepoznavanje istog oblika iz drugog ugla). Nacrtaj je tako da se napravi od onoga što domaćinstvo baca, za jedno popodne, rukama roditelja koji nije majstor.' },
    hand: { en: 'One A3: the toy drawn at 1:1 or 1:2 with real dimensions, an exploded view of its parts with the material of each, one sentence naming the hand movement and one naming the spatial operation, the observable that says it worked (what you would see a child do), and the small-parts check — ⌀31,7 mm cylinder, depth 25,4–57,1 mm — marked on every loose part.', sr: 'Jedan A3: igračka nacrtana 1:1 ili 1:2 sa stvarnim merama, razloženi prikaz delova sa materijalom svakog, jedna rečenica koja imenuje pokret ruke i jedna koja imenuje radnju nad prostorom, posmatrivi znak da je radila (šta bi video da dete uradi) i provera sitnih delova — cilindar ⌀31,7 mm, dubina 25,4–57,1 mm — označena na svakom odvojivom delu.' },
    check: { en: 'A toy that only one kind of child can use fails: say how two children with different bodies play with it at the same table. A part that fits whole into the ⌀31,7 mm cylinder fails for under-threes — say so on the sheet or change the part. “It develops the child” is not an observable; “the child moves the cap from the left rod to the right one without turning the box” is. No diagnosis is written anywhere on the sheet.', sr: 'Igračka koju može da koristi samo jedna vrsta deteta ne prolazi: napiši kako se njome igraju dvoje dece različitih tela za istim stolom. Deo koji ceo stane u cilindar ⌀31,7 mm pada za uzrast ispod tri godine — upiši to na list ili promeni deo. „Razvija dete” nije posmatriv znak; „dete prebaci čep sa leve šipke na desnu bez okretanja kutije” jeste. Nijedna dijagnoza se ne upisuje na list.' },
    source: { label: 'EN 71-1 small parts cylinder (⌀31,7 mm) — Safety of toys, mechanical and physical properties', url: 'https://law.resource.org/pub/eu/toys/en.71.1.2014.html' }
  },
  {
    id: 'app-for-one', week: 8, stage: 2, kind: 'drawing',
    title: { en: 'An application for one person', sr: 'Aplikacija za jednu osobu' },
    task: { en: 'Day one, by hand. Choose one person and one situation you have actually observed — a stop, a counter, an entrance, a corridor, a form. Design the first three screens of a phone application that does one thing for that person in that situation. Draw the screens at real size, write what each element is for, and name the one thing the application refuses to do.', sr: 'Prvi dan, rukom. Izaberi jednu osobu i jednu situaciju koju si stvarno video — stanicu, pult, ulaz, hodnik, formular. Projektuj prva tri ekrana telefonske aplikacije koja za tu osobu u toj situaciji radi jednu stvar. Nacrtaj ekrane u pravoj meri, napiši čemu služi svaki element i navedi jednu stvar koju aplikacija odbija da radi.' },
    hand: { en: 'Lower third of the week 8 A3, beside the diagram of flows: three screens at real size (about 7 × 15 cm each), plus six lines of text: the person, the situation, the one sentence of purpose, the constraint, what it does not do, and three questions for the person. The situation is one of the points of interruption you mapped.', sr: 'Donja trećina A3 lista za 8. nedelju, pored dijagrama tokova: tri ekrana u pravoj meri (oko 7 × 15 cm svaki) i šest redova teksta: osoba, situacija, jedna rečenica svrhe, ograničenje, šta ne radi i tri pitanja za tu osobu. Situacija je jedna od tačaka prekida koje si mapirao.' },
    check: { en: 'An invented user does not count: write where and when you observed the situation. A screen without a stated purpose for every element does not count. If the application does everything, it has no purpose — the refusal is part of the design.', sr: 'Izmišljen korisnik se ne priznaje: upiši gde i kada si situaciju posmatrao. Ekran bez upisane svrhe za svaki element se ne priznaje. Ako aplikacija radi sve, nema svrhu — odbijanje je deo projekta.' },
    source: { label: 'Microsoft Inclusive Design Toolkit — solve for one, extend to many', url: 'https://inclusive.microsoft.design/' }
  },
  {
    id: 'prototype-from-waste', week: 2, stage: 1, kind: 'making',
    title: { en: 'The prototype on the table', sr: 'Prototip na stolu' },
    task: { en: 'Build the toy you drew. A working model, small, at the real size of the hand that will hold it — not a presentation model. Material in this order: found (packaging, caps, offcuts), reusable (something that was already something else), bought (and then the price goes on the sheet), printed last and only for the part that cannot be found or bought — a connector, a bushing, a jig, a gauge. Then hand it, without a word of explanation, to somebody who has never seen it, and write down what they did first.', sr: 'Napravi igračku koju si nacrtao. Radni model, mali, u pravoj meri ruke koja će ga držati — ne maketa za prikazivanje. Materijal ovim redom: nađeno (ambalaža, čepovi, otpaci), ponovo upotrebljivo (ono što je već bilo nešto drugo), kupljeno (i onda cena ide na list), štampano poslednje i samo za deo koji ne može da se nađe niti kupi — spojnica, čaura, šablon, merilo. Pa je bez ijedne reči objašnjenja daj nekome ko je nikad nije video i upiši šta je prvo uradio.' },
    hand: { en: 'The object itself, plus the upper half of the week 2 A3: a photograph of the prototype in a hand, a parts list with the origin and the price of each part, the three changes the material forced on the drawing, the small parts check repeated on the built object after it has been dropped, and one sentence on the part that must be printed and why it could not be found.', sr: 'Sam predmet, i gornji deo A3 lista za 2. nedelju: fotografija prototipa u ruci, spisak delova sa poreklom i cenom svakog, tri izmene koje je materijal nametnuo crtežu, provera sitnih delova ponovljena na napravljenom predmetu pošto je pao, i jedna rečenica o delu koji mora da se odštampa i zašto nije mogao da se nađe.' },
    check: { en: 'A prototype that was not handed to a second person has not been tested — write down the name and what they did first. A parts list without origins is a shopping list: say which part came out of a bin. A printed part with no sentence explaining why it could not be found does not count, and neither does a part that fits whole into the ⌀31,7 mm cylinder on a toy declared for under-threes. If nothing broke and nothing changed from the drawing, you built a model of your drawing, not a prototype of your toy.', sr: 'Prototip koji nije dat drugoj osobi nije ispitan — upiši ime i šta je prvo uradila. Spisak delova bez porekla je spisak za kupovinu: napiši koji deo je došao iz korpe za otpatke. Štampan deo bez rečenice zašto nije mogao da se nađe se ne priznaje, kao ni deo koji ceo stane u cilindar ⌀31,7 mm na igrački koja je deklarisana za uzrast ispod tri godine. Ako se ništa nije slomilo i ništa se nije promenilo u odnosu na crtež, napravio si maketu svog crteža, a ne prototip svoje igračke.' },
    source: { label: 'EN 71-1 — small parts cylinder and the 220 mm cord limit for toys under 18 months', url: 'https://law.resource.org/pub/eu/toys/en.71.1.2014.html' }
  },
  {
    id: 'seven-principles-audit', week: 2, stage: 1, kind: 'drawing',
    title: { en: 'Seven principles, one object', sr: 'Sedam principa, jedan predmet' },
    task: { en: 'Judge your own prototype against all seven principles, in order — the object on the table, not the intention behind it. For each principle give one photograph, one sentence of evidence and a verdict: met, partly met, failed. Wherever it can be, the evidence is taken from somebody else’s hands.', sr: 'Oceni sopstveni prototip po svih sedam principa, redom — predmet na stolu, a ne nameru iza njega. Za svaki princip daj jednu fotografiju, jednu rečenicu dokaza i ocenu: ispunjen, delimično ispunjen ili nije ispunjen. Gde god može, dokaz se uzima iz tuđih ruku.' },
    hand: { en: 'Lower half of the week 2 A3: seven evidence entries under the prototype, which occupies the upper half of the same sheet.', sr: 'Donji deo A3 lista za 2. nedelju: sedam zapisa dokaza ispod prototipa, koji zauzima gornji deo istog lista.' },
    check: { en: 'A verdict without a photograph, a sketch or a measurement does not count. At least two principles must fail — if nothing failed, you audited your intention, not your prototype.', sr: 'Ocena bez fotografije, skice ili mere ne važi. Bar dva principa moraju da padnu — ako ništa nije palo, ocenio si svoju nameru, a ne svoj prototip.' },
    source: { label: 'The Principles of Universal Design v2.0 (NC State, 1997)', url: 'https://design.ncsu.edu/research/center-for-universal-design/' }
  },
  {
    id: 'measure-your-faculty', week: 3, stage: 1, kind: 'measurement',
    title: { en: 'Measure your own faculty', sr: 'Izmeri sopstveni fakultet' },
    task: { en: 'Measure the building you study in: door clear widths, corridor widths, ramp and threshold slopes, handle and switch heights, the accessible toilet, the lift car and its call buttons. Use a tape and a spirit level or a phone inclinometer; record the instrument and its resolution.', sr: 'Izmeri zgradu u kojoj studiraš: svetle širine vrata, širine hodnika, nagibe rampi i pragova, visine kvaka i prekidača, pristupačni toalet, kabinu lifta i pozivne tastere. Koristi metar i libelu ili inklinometar na telefonu; upiši instrument i njegovu rezoluciju.' },
    hand: { en: 'A table: element · location · measured value · instrument · uncertainty.', sr: 'Tabela: element · mesto · izmerena vrednost · instrument · nesigurnost.' },
    check: { en: 'Every row names its instrument. A value without an uncertainty is not a measurement, it is an impression.', sr: 'Svaki red navodi instrument. Vrednost bez nesigurnosti nije mera nego utisak.' },
    source: { label: 'Course syllabus, week 3', url: '' }
  },
  {
    id: 'hands-and-tolerances', week: 3, stage: 1, kind: 'measurement',
    title: { en: 'The hand that holds it', sr: 'Ruka koja drži' },
    task: { en: 'Measure three real hands — yours and two that differ from yours in age or size; if a trial at the association is agreed, one of the three may be a hand from there. For each hand take five measures: hand length, hand breadth, maximum grip diameter, span from thumb to fingertip, and wrist rotation you can watch (no simulation — you measure a hand, you do not pretend one). Then take the object you are developing: your prototype if it survived the audit, or — if there is no prototype on your table — a household object you choose to redesign (a cup handle, a door handle, a tap, a tool). Give it three numbers: the smallest hand it serves, the largest hand it serves, and the one you design for. State what the object must tolerate so that all three hands hold it.', sr: 'Izmeri tri stvarne ruke — svoju i dve koje se od tvoje razlikuju po godinama ili veličini; ako je probavanje u udruženju dogovoreno, jedna od tri sme biti ruka odatle. Za svaku ruku uzmi pet mera: dužina šake, širina šake, najveći prečnik hvata, raspon od palca do vrha prsta i rotacija zgloba koju možeš da posmatraš (bez simulacije — meriš ruku, ne pretvaraš se). Pa uzmi predmet koji razvijaš: svoj prototip ako je preživeo proveru, a ako prototipa nema na stolu — kućni predmet koji biraš za prepravku (drška šolje, kvaka, slavina, alatka). Daj mu tri broja: najmanja ruka koju opslužuje, najveća ruka koju opslužuje i ona za koju projektuješ. Kaži šta predmet mora da toleriše da sve tri ruke da ga drže.' },
    hand: { en: 'Upper half of the week 3 A3: the hand table (3 hands × 5 measures, each row with instrument and uncertainty) above the object drawn at 1:1 or 1:2, with the three tolerance numbers written on the drawing. The faculty table below is the lower half of the same sheet.', sr: 'Gornji deo A3 lista za 3. nedelju: tabela ruku (3 ruke × 5 mera, svaki red sa instrumentom i nesigurnošću) iznad predmeta nacrtanog u 1:1 ili 1:2, sa tri broja tolerancije upisana na crtež. Tabela fakulteta ispod je donji deo istog lista.' },
    check: { en: 'A tolerance without a measured hand behind it does not count. If all three hands hold the object identically, you measured one hand three times. If your prototype failed the audit last week, this sheet must show what you changed because of the hands — or say plainly that you changed nothing, and defend that.', sr: 'Tolerancija bez izmerene ruke iza nje ne važi. Ako sve tri ruke drže predmet isto, izmerio si jednu ruku tri puta. Ako je prototip prošle nedelje pao na proveri, ovaj list mora da pokaže šta si zbog ruku promenio — ili da kaže otvoreno da nisi ništa, i da to odbrani.' },
    source: { label: 'Panero & Zelnik, Human Dimension and Interior Space — anthropometric atlas', url: '' }
  },
  {
    id: 'rulebook-cross-check', week: 4, stage: 2, kind: 'reading',
    title: { en: 'The Rulebook against your own drawing', sr: 'Pravilnik naspram tvog crteža' },
    task: { en: 'Open the original text of the Rulebook (Official Gazette RS 22/2015 and 10/2026). For every element you measured in week 3, find the article that governs it, write the required value, and compare. Do not copy values from the lecture or from an AI tool: cite the article number.', sr: 'Otvori izvorni tekst Pravilnika („Sl. glasnik RS” 22/2015 i 10/2026). Za svaki element izmeren u 3. nedelji nađi član koji ga uređuje, upiši traženu vrednost i uporedi. Ne prepisuj vrednosti sa predavanja ni iz AI alata: navedi broj člana.' },
    hand: { en: 'A compliance table: element · article · required · achieved · compliant yes/no · note.', sr: 'Tabela usklađenosti: element · član · zahtevano · postignuto · usklađeno da/ne · napomena.' },
    check: { en: 'An article number with no quoted value is a bluff. Where the Rulebook is silent, write “not regulated” — that is a finding, not a gap in your work.', sr: 'Broj člana bez citirane vrednosti je blef. Gde Pravilnik ćuti, upiši „nije propisano” — to je nalaz, a ne rupa u radu.' },
    source: { label: 'Legal information system of the Republic of Serbia', url: 'https://www.pravno-informacioni-sistem.rs/' }
  },
  {
    id: 'where-regulation-ends', week: 5, stage: 2, kind: 'reading',
    title: { en: 'Where the regulation ends', sr: 'Gde propis prestaje' },
    task: { en: 'Find one condition in your week 3 building that is fully compliant and still bad to use, and one that breaches the Rulebook and is harmless in practice. Argue both in six sentences. This is the boundary the course is about.', sr: 'Nađi u zgradi iz 3. nedelje jedan uslov koji je potpuno usklađen a i dalje loš za upotrebu, i jedan koji krši Pravilnik a u praksi ne smeta. Obrazloži oba u šest rečenica. To je granica kojom se ovaj predmet bavi.' },
    hand: { en: 'One page, two cases, with the drawing or photograph that makes each visible.', sr: 'Jedna strana, dva slučaja, uz crtež ili fotografiju koja svaki od njih pokazuje.' },
    check: { en: 'Compliance and usefulness must be argued separately. Saying “the standard is wrong” without naming the activity it fails is not an argument.', sr: 'Usklađenost i korisnost se obrazlažu odvojeno. „Standard je pogrešan” bez imenovanja aktivnosti koju izneverava nije argument.' },
    source: { label: 'EN 17210 — functional requirements', url: 'https://standards.cencenelec.eu/' }
  },
  {
    id: 'field-obstacle-record', week: 6, stage: 1, kind: 'fieldwork',
    title: { en: 'The obstacle record', sr: 'Popis prepreka' },
    task: { en: 'On the site, record every point where the ground forces a change of behaviour: a step, a kerb, a surface change, a gradient above 8,3 %, an obstruction, a missing handrail, a place with nowhere to rest. Photograph with a scale object. Log the coordinate.', sr: 'Na lokaciji zabeleži svaku tačku na kojoj teren tera na promenu ponašanja: stepenik, ivičnjak, promena podloge, nagib preko 8,3 %, prepreka, nedostatak rukohvata, mesto bez ičega za predah. Fotografiši sa predmetom za razmeru. Upiši koordinatu.' },
    hand: { en: 'A photographic obstacle register with coordinates and a map of the points.', sr: 'Foto-registar prepreka sa koordinatama i mapa tačaka.' },
    check: { en: 'Each entry says what the obstacle prevents, not who it prevents. “Too steep for wheelchairs” is a conclusion; “17 % over 6 m, no landing” is a record.', sr: 'Svaki zapis kaže šta prepreka onemogućava, a ne kome. „Prestrmo za kolica” je zaključak; „17 % na 6 m, bez odmorišta” je zapis.' },
    source: { label: 'Project brief „Živimo zajedno”, §2', url: '' }
  },
  {
    id: 'slope-map', week: 7, stage: 1, kind: 'digital',
    title: { en: 'The slope map from 151 points', sr: 'Mapa nagiba iz 151 tačke' },
    task: { en: 'Build a terrain model from the 151 measured points and derive a slope map in three bands: below 5 %, 5–8,3 %, above 8,3 %. Draw the line beyond which no compliant route can pass. QGIS is free and sufficient.', sr: 'Napravi model terena iz 151 izmerene tačke i izvedi mapu nagiba u tri pojasa: < 5 %, 5–8,3 %, > 8,3 %. Povuci granicu iza koje nijedna usklađena trasa ne prolazi. QGIS je besplatan i dovoljan.' },
    hand: { en: 'Slope map at 1:500 with legend, projection (EPSG:32634) and interpolation method named.', sr: 'Mapa nagiba 1:500 sa legendom, projekcijom (EPSG:32634) i navedenom metodom interpolacije.' },
    check: { en: 'Name the interpolation. A surface drawn through points with 2–3 m vertical uncertainty must not be presented as a contour survey.', sr: 'Imenuj interpolaciju. Površ provučena kroz tačke sa 2–3 m vertikalne nesigurnosti ne sme da se prikaže kao geodetski snimak izohipsi.' },
    source: { label: 'QGIS', url: 'https://qgis.org/' }
  },
  {
    id: 'access-matrix', week: 8, stage: 2, kind: 'drawing',
    title: { en: 'The access matrix', sr: 'Matrica pristupa' },
    task: { en: 'For every entry point and every programme element, fill one row per user: wheelchair, pram, cane or walker, low vision, person without difficulty. Columns: from where, by which route, distance, total rise, time, number of rests. Compute, do not estimate.', sr: 'Za svaku ulaznu tačku i svaki sadržaj popuni po jedan red po korisniku: kolica, kolica za bebe, štap ili hodalica, oštećenje vida, osoba bez teškoća. Kolone: odakle, kojom trasom, dužina, ukupan uspon, vreme, broj predaha.' },
    hand: { en: 'The matrix plus a route plan with each row drawn on it.', sr: 'Matrica i plan trasa na kome je svaki red ucrtan.' },
    check: { en: 'If two users have different routes to the same door, the design has already failed criterion three. Say so in the table instead of hiding it.', sr: 'Ako dva korisnika imaju različite trase do istih vrata, projekat već pada na trećem kriterijumu. Napiši to u tabeli umesto da sakriješ.' },
    source: { label: 'Project brief „Živimo zajedno”, §5.2', url: '' }
  },
  {
    id: 'sensory-load-section', week: 9, stage: 3, kind: 'drawing',
    title: { en: 'Draw the sensory load', sr: 'Nacrtaj senzorno opterećenje' },
    task: { en: 'Choose one place on the site and draw a section that shows what is heard, seen and felt, not only what is built: sound sources and reflecting surfaces, glare and backlight, wind and sun, crowding at peak time. Then draw the place of retreat and show how someone reaches it without crossing the loudest zone.', sr: 'Izaberi jedno mesto na lokaciji i nacrtaj presek koji pokazuje šta se čuje, vidi i oseća, a ne samo šta je sagrađeno: izvore zvuka i reflektujuće površine, bleštanje i svetlo iza sagovornika, vetar i sunce, gužvu u vršnom času. Zatim nacrtaj mesto povlačenja i pokaži kako se do njega stiže bez prolaska kroz najglasniju zonu.' },
    hand: { en: 'One section 1:100 with a sensory legend and one diagram of the retreat route.', sr: 'Jedan presek 1:100 sa čulnom legendom i jedan dijagram putanje do mesta povlačenja.' },
    check: { en: 'A retreat that is visible from the main space is not a retreat. Predictability counts as a drawn quality: show how a person knows what comes next.', sr: 'Mesto povlačenja koje se vidi iz glavnog prostora nije mesto povlačenja. Predvidljivost je crtežno svojstvo: pokaži kako čovek zna šta sledi.' },
    source: { label: 'Kelly, Kerr, Rieger & Cushing (2025), Let’s Play — co-designing inclusive school playgrounds', url: 'https://doi.org/10.1016/j.ijedro.2025.100494' }
  },
  {
    id: 'walkthrough', week: 10, stage: 4, kind: 'participatory',
    title: { en: 'The walkthrough that changes the drawing', sr: 'Provera koja menja crtež' },
    task: { en: 'Agree one real task with a coauthor — arrive, enter, find the toilet, sit down, leave. Walk it together. Record what happened, in their words, and what you had assumed. Then name the single drawing you will change because of it.', sr: 'Dogovori sa koautorom jedan stvaran zadatak — stići, ući, naći toalet, sesti, izaći. Pređite ga zajedno. Zabeleži šta se desilo, rečima koautora, i šta si ti pretpostavljao. Zatim imenuj jedan crtež koji ćeš zbog toga promeniti.' },
    hand: { en: 'Minutes: who took part, what was tried, what was discovered, what changed in the project.', sr: 'Zapisnik: ko je učestvovao, šta je probano, šta je otkriveno, šta je promenjeno u projektu.' },
    check: { en: 'No disability simulation. Participation is voluntary and may stop at any moment. Minutes that record no change to the project are minutes of a demonstration, not of a check.', sr: 'Bez simulacije invaliditeta. Učešće je dobrovoljno i može se prekinuti u svakom trenutku. Zapisnik koji ne beleži nijednu promenu u projektu je zapisnik demonstracije, a ne provere.' },
    source: { label: 'W3C WAI — involving users in evaluation', url: 'https://www.w3.org/WAI/test-evaluate/involving-users/' }
  },
  {
    id: 'three-strategies', week: 11, stage: 3, kind: 'drawing',
    title: { en: 'Three ways up the hill', sr: 'Tri načina da se savlada padina' },
    task: { en: 'Draw three materially different strategies for overcoming 22,5 m: for example a switchback terrace route, a route lengthened by programme, and a mechanical assist. Same scale, same base. For each: length, gradient profile, number of landings, what it costs the site, and what happens when it breaks.', sr: 'Nacrtaj tri suštinski različite strategije za savladavanje 22,5 m: na primer serpentinu u terasama, trasu produženu programom i mehaničku pomoć. Ista razmera, ista podloga. Za svaku: dužina, dijagram nagiba, broj odmorišta, šta košta lokaciju i šta se dešava kada se pokvari.' },
    hand: { en: 'Three comparable plan-and-profile studies plus a trade-off table.', sr: 'Tri uporedive studije u osnovi i podužnom profilu, uz tabelu kompromisa.' },
    check: { en: 'A mechanical assist that can fail must have a declared fallback route. A strategy without a gradient profile is a sketch, not an option.', sr: 'Mehanička pomoć koja može da otkaže mora da ima izjavljenu rezervnu trasu. Strategija bez dijagrama nagiba je skica, a ne varijanta.' },
    source: { label: 'Project brief „Živimo zajedno”, §1', url: '' }
  },
  {
    id: 'wayfinding-without-sight', week: 12, stage: 5, kind: 'drawing',
    title: { en: 'Find the way without seeing the sign', sr: 'Nađi put bez gledanja u znak' },
    task: { en: 'Describe the route from the entrance to the main destination using only non-visual and tactile information: surface changes, acoustic cues, handrail continuity, slope, warning fields, scent and draught. Then draw what you must add to the plan so the description is true.', sr: 'Opiši put od ulaza do glavnog odredišta koristeći samo nevizuelne i taktilne informacije: promene podloge, akustičke tragove, neprekidnost rukohvata, nagib, polja upozorenja, miris i promaju. Zatim nacrtaj šta moraš dodati u osnovu da bi opis bio istinit.' },
    hand: { en: 'A written route description and a revised plan at 1:200 with the added cues.', sr: 'Pisan opis trase i izmenjena osnova 1:200 sa dodatim tragovima.' },
    check: { en: 'The description must work read aloud, with no plan in hand. A tactile path that stops at a door and resumes nowhere fails the exercise.', sr: 'Opis mora biti razumljiv kada se pročita naglas, bez osnove u ruci. Taktilna staza koja se prekine kod vrata i nigde se ne nastavlja ne prolazi proveru.' },
    source: { label: 'ISO 21542 — accessibility and usability of the built environment', url: 'https://www.iso.org/standard/71860.html' }
  },
  {
    id: 'threshold-detail', week: 13, stage: 5, kind: 'drawing',
    title: { en: 'The detail that carries the project', sr: 'Detalj koji nosi projekat' },
    task: { en: 'Draw at 1:10 the one change of level that decides whether the whole route works: the ramp head, the threshold, the tactile field or the handrail return. Include material, fixing, drainage, winter behaviour and who maintains it in year five.', sr: 'Nacrtaj u 1:10 onaj prelaz visine koji odlučuje da li cela trasa radi: vrh rampe, prag, taktilno polje ili povratak rukohvata. Unesi materijal, način pričvršćenja, odvodnjavanje, ponašanje zimi i ko ga održava pete godine.' },
    hand: { en: 'One detail at 1:10 with a maintenance note of at most five lines.', sr: 'Jedan detalj 1:10 sa napomenom o održavanju od najviše pet redova.' },
    check: { en: 'Luminance contrast of the tactile field is stated as a number. A detail with no maintenance note is a detail that will be removed by the first repair.', sr: 'Kontrast osvetljenosti taktilnog polja navodi se brojem. Detalj bez napomene o održavanju je detalj koji će nestati pri prvoj popravci.' },
    source: { label: 'Colour Contrast Analyser', url: 'https://www.tpgi.com/color-contrast-checker/' }
  },
  {
    id: 'cross-review', week: 14, stage: 6, kind: 'reading',
    title: { en: 'Audit someone else’s project', sr: 'Oceni tuđi projekat' },
    task: { en: 'Take another team’s hand-in. Apply their own compliance table to their own drawings and check whether the numbers agree. Then apply the three automatic-fail tests. Write the audit as you would want yours written.', sr: 'Uzmi predaju drugog tima. Primeni njihovu tabelu usklađenosti na njihove crteže i proveri da li se brojevi slažu. Zatim primeni tri testa automatskog pada. Napiši ocenu onako kako bi želeo da tvoja bude napisana.' },
    hand: { en: 'Left half of the week 14 A3: three confirmed strengths, three defects with evidence, one question.', sr: 'Leva polovina A3 lista za 14. nedelju: tri potvrđene vrline, tri nedostatka sa dokazom i jedno pitanje.' },
    check: { en: 'Every defect cites a drawing and a number. An audit with no confirmed strength was not read carefully.', sr: 'Svaki nedostatak navodi crtež i broj. Ako ocena ne potvrdi nijednu vrlinu, projekat nije pažljivo pregledan.' },
    source: { label: 'Project brief „Živimo zajedno”, §7', url: '' }
  },
  {
    id: 'post-occupancy', week: 14, stage: 6, kind: 'fieldwork',
    title: { en: 'Measure a finished building, not a promise', sr: 'Izmeri gotovu zgradu, ne obećanje' },
    task: { en: 'Find a recently built or renovated public building in Belgrade that declares itself accessible. Do a short post-occupancy check: can you complete three ordinary tasks using one route? Record what was built as drawn, what was built differently, and what was added later by the people using it.', sr: 'Nađi nedavno izgrađen ili obnovljen javni objekat u Beogradu koji je proglašen pristupačnim. Uradi kratku proveru posle useljenja: mogu li se tri obična zadatka obaviti jednom trasom? Zabeleži šta je izvedeno kao na crtežu, šta drugačije i šta su korisnici dodali naknadno.' },
    hand: { en: 'Right half of the week 14 A3: three concise task narratives with photographs and one finding.', sr: 'Desna polovina A3 lista za 14. nedelju: tri sažeta opisa zadatka sa fotografijama i jedan nalaz.' },
    check: { en: 'Added ramps, wedged doors and handwritten signs are the most valuable evidence in the exercise: they are the building telling you what the drawing got wrong.', sr: 'Naknadne rampe, vrata poduprta u otvorenom položaju i rukom pisani natpisi najvredniji su dokaz u vežbi: to zgrada govori šta je crtež promašio.' },
    source: { label: 'Course syllabus, week 14 (POE)', url: '' }
  },
  {
    id: 'accessible-handover', week: 15, stage: 6, kind: 'digital',
    title: { en: 'A hand-over that survives without you', sr: 'Predaja koja preživi bez tebe' },
    task: { en: 'Prepare the public version of the project so it is usable by someone who cannot see the boards: a structured text description of the site, the problem, the strategy and the critical detail; image descriptions for each board; and the compliance table as text, not as a picture of a table.', sr: 'Pripremi javnu verziju projekta tako da je upotrebljiva i za osobu koja ne vidi table: strukturisan tekstualni opis lokacije, problema, strategije i ključnog detalja; opisi slika za svaku tablu; i tabela usklađenosti kao tekst, a ne kao slika tabele.' },
    hand: { en: 'Upper part of the week 15 A3: a structured summary, key image descriptions and a readable excerpt from the compliance table. Public posting is optional and requires permission.', sr: 'Gornji deo A3 lista za 15. nedelju: strukturisan sažetak, ključni opisi slika i čitljiv izvod iz tabele usklađenosti. Javna objava je neobavezna i zahteva dozvolu.' },
    check: { en: 'Read the summary aloud to someone who has not seen the project. If they cannot restate the strategy, it is not finished. A table flattened into an image is unreadable to a screen reader.', sr: 'Pročitaj sažetak naglas nekome ko nije video projekat. Ako ne može da prepriča strategiju, nije gotovo. Tabela pretvorena u sliku čitaču ekrana je nečitljiva.' },
    source: { label: 'W3C WAI — complex images', url: 'https://www.w3.org/WAI/tutorials/images/complex/' }
  },
  {
    id: 'ai-claim-check', week: 15, stage: 6, kind: 'digital',
    title: { en: 'Catch the model in an error', sr: 'Uhvati model u grešci' },
    task: { en: 'Ask an AI tool for the accessibility requirements that apply to your project. Then check every number it gives against the original text of the Rulebook. Record each claim, the article you checked, and the verdict: correct, wrong, or invented.', sr: 'Pitaj AI alat koji zahtevi pristupačnosti važe za tvoj projekat. Zatim proveri svaki broj prema izvornom tekstu Pravilnika. Zabeleži svaku tvrdnju, član koji si proverio i ocenu: tačno, netačno ili izmišljeno.' },
    hand: { en: 'Lower part of the week 15 A3: a claim-check table and a two-sentence conclusion about where the tool helped and where it would have cost you the exam.', sr: 'Donji deo A3 lista za 15. nedelju: tabela provere tvrdnji i zaključak u dve rečenice — gde je alat pomogao, a gde bi te koštao ispita.' },
    check: { en: 'Declare the tool and the date. A table in which nothing was wrong means you asked questions whose answers you already knew.', sr: 'Navedi alat i datum. Tabela u kojoj ništa nije bilo pogrešno znači da si pitao ono što već znaš.' },
    source: { label: 'Course rules: AI tools are allowed and declared', url: '' }
  }
];

// Longer pieces of work. Seeds for seminar papers, competitions and student research —
// each one is a gap the course can actually fill, not a topic list.
export const ideas = [
  {
    id: 'belgrade-slope-atlas', scale: { en: 'Seminar paper · one semester', sr: 'Seminarski rad · jedan semestar' },
    title: { en: 'An atlas of Belgrade’s unwalkable slopes', sr: 'Atlas nesavladivih beogradskih padina' },
    body: { en: 'Map the city blocks where the terrain alone makes a compliant route impossible without a strategy. Open data plus field checks. The result is a planning argument, not a complaint: these are the places where the Rulebook is satisfied on paper and nobody can get up the hill.', sr: 'Mapiraj gradske blokove u kojima sam teren čini usklađenu trasu nemogućom bez strategije. Otvoreni podaci i provera na terenu. Rezultat je planski argument, a ne žalba: to su mesta gde je Pravilnik zadovoljen na papiru, a niko ne može da se popne uz padinu.' },
    why: { en: 'The course already measures one such hill. Fifteen of them make a publishable finding.', sr: 'Predmet već meri jednu takvu padinu. Petnaest takvih padina čini nalaz za objavljivanje.' }
  },
  {
    id: 'poe-register', scale: { en: 'Multi-year · course archive', sr: 'Višegodišnje · arhiva predmeta' },
    title: { en: 'A post-occupancy register of declared-accessible buildings', sr: 'Registar provera objekata proglašenih pristupačnim' },
    body: { en: 'Each generation of students audits three recently completed public buildings and adds them to one public register: what was promised, what was built, what users changed afterwards. After four years the register is evidence no single study can produce.', sr: 'Svaka generacija studenata ocenjuje po tri nedavno završena javna objekta i upisuje ih u jedan javni registar: šta je obećano, šta je izvedeno, šta su korisnici naknadno promenili. Posle četiri godine registar je dokaz kakav nijedna pojedinačna studija ne daje.' },
    why: { en: 'Serbia has compliance documents and almost no published post-occupancy evidence.', sr: 'Srbija ima dokumenta o usklađenosti i gotovo nijedan objavljen dokaz posle useljenja.' }
  },
  {
    id: 'ud-ai-mapping', scale: { en: 'Research paper · with the teacher', sr: 'Naučni rad · sa nastavnikom' },
    title: { en: 'The seven principles mapped onto AI systems', sr: 'Sedam principa preslikanih na AI sisteme' },
    body: { en: 'There is no peer-reviewed one-to-one mapping of the seven universal design principles onto AI systems. The 1997 principles were written for products and environments; software was in scope from the start. Produce the mapping, with a test for each principle, and validate it on three real assistive systems.', sr: 'Ne postoji recenzirano preslikavanje sedam principa univerzalnog dizajna na AI sisteme, jedan na jedan. Principi iz 1997. pisani su za proizvode i okruženja; softver je od početka bio u obuhvatu. Napravi preslikavanje, sa testom za svaki princip, i proveri ga na tri stvarna asistivna sistema.' },
    why: { en: 'Identified as an open gap during the research pass of 2026-10-01; the compendium holds the groundwork.', sr: 'Prepoznato kao otvorena praznina u istraživačkom prolazu 01.10.2026; kompendijum drži podlogu.' }
  },
  {
    id: 'tactile-site-model', scale: { en: 'Making · two weeks', sr: 'Izrada · dve nedelje' },
    title: { en: 'A tactile model of the site, made with its users', sr: 'Taktilni model lokacije, napravljen sa korisnicima' },
    body: { en: 'Build a relief model of the 22,5 m fall that can be read by hand, with the three slope bands as three textures. Test landmark recognition with blind and low-vision coauthors and revise the symbols they could not resolve. The model then serves every later review on the site.', sr: 'Napravi reljefni model pada od 22,5 m koji se čita rukom, sa tri pojasa nagiba kao tri teksture. Proveri prepoznavanje orijentira sa slepim i slabovidim koautorima i popravi simbole koje nisu razlikovali. Model posle služi na svakom narednom pregledu.' },
    why: { en: 'A terrain nobody can read is a terrain nobody can argue with.', sr: 'Teren koji niko ne može da pročita je teren o kome niko ne može da raspravlja.' }
  },
  {
    id: 'association-brief-library', scale: { en: 'Ongoing · with the association', sr: 'Kontinuirano · sa udruženjem' },
    title: { en: 'A library of briefs written by associations', sr: 'Biblioteka zadataka koje pišu udruženja' },
    body: { en: 'Instead of students choosing a site, associations submit the places that actually block them, in their own words, with photographs. Each entry becomes a candidate brief for a future year. The association owns the entry and can withdraw it.', sr: 'Umesto da studenti biraju lokaciju, udruženja prijavljuju mesta koja ih stvarno zaustavljaju, svojim rečima i sa fotografijama. Svaki unos postaje kandidat za zadatak naredne godine. Unos pripada udruženju i može biti povučen.' },
    why: { en: 'It moves the association from reviewer to author of the question — the only rung of Arnstein’s ladder that is not tokenism.', sr: 'Pomera udruženje sa mesta recenzenta na mesto autora pitanja — jedina prečaga Arnsteinove lestvice koja nije tokenizam.' }
  },
  {
    id: 'usefulness-instrument', scale: { en: 'Research · long-term', sr: 'Istraživanje · dugoročno' },
    title: { en: 'An instrument for measuring whether the result was useful', sr: 'Instrument za merenje da li je rezultat bio koristan' },
    body: { en: 'Assistive technology has validated instruments — PIADS, QUEST, IPPA. Student architectural proposals have none: usefulness is asserted at the defence and never checked. Adapt an existing instrument to the handover of a student proposal and run it for three cohorts.', sr: 'Asistivna tehnologija ima validirane instrumente — PIADS, QUEST, IPPA. Studentski arhitektonski predlozi nemaju nijedan: korisnost se tvrdi na odbrani i nikad ne proverava. Prilagodi postojeći instrument predaji studentskog predloga i primeni ga na tri generacije.' },
    why: { en: 'Measured in the research pass: 29,3 % of assistive devices are abandoned. Nobody measures the abandonment rate of student proposals, which is presumably higher.', sr: 'Izmereno u istraživačkom prolazu: 29,3 % asistivnih uređaja biva napušteno. Niko ne meri stopu napuštanja studentskih predloga, koja je verovatno viša.' }
  }
];
