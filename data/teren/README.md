# Terenske podloge: Lokacija „Živimo zajedno” (Beograd)

Ovaj folder sadrži georeferencirane terenske podatke premera lokacije udruženja „Živimo zajedno”, namenjene vežbama na predmetu *Principi univerzalnog dizajna* (FGM Beograd).

---

## 1. Koordinatni referentni sistem (CRS)

- **Projekcija:** UTM Zone 34N — **EPSG:32634** (kolone `X`, `Y` u metrima)
- **Geografske koordinate:** WGS 84 — **EPSG:4326** (kolone `Latitude`, `Longitude` u decimalnim stepenima)
- **Visine:** Elipsoidna/ortometrijska visina u metrima (kolona `Elevation`)

---

## 2. Opis datoteka

| Fajl | Sadržaj | Broj tačaka | Merna nesigurnost |
|---|---|---|---|
| `zivimo zajedno_Visine.csv` | 151 snimljena visinska tačka terena | 151 | Horiz: ±1,5–2,5 m · Vert: ±2,0–3,0 m |
| `zivimo zajedno_FEATURE_POINTS.csv` | Tačke preloma i karakterističnih elemenata | 151 | Isto |
| `zivimo zajedno_TRACKS.csv` | Metapodaci geodetske rute kretanja | 1 | GPS kontinualni trag |
| `zivimo zajedno_TRACK_POINTS.csv` | Snimljene tačke trase hoda | uzorci | ±2 m |
| `zivimo zajedno_PHOTOS.csv` | Foto-registar sa terena | referentne veze | Terenski izlazak 24.11.2025. |

---

## 3. Uputstvo za uvoz u softverske pakete

### A. QGIS (za 7. nedelju — mapa nagiba)
1. Otvoriti QGIS i izabrati **Layer → Add Layer → Add Delimited Text Layer**.
2. Izabrati `zivimo zajedno_Visine.csv`.
3. Pod **Geometry Definition** izabrati **Point coordinates**:
   - `X field`: **X**
   - `Y field`: **Y**
   - `Z field`: **Elevation**
   - **Geometry CRS**: izabrati `EPSG:32634 - WGS 84 / UTM zone 34N`.
4. Za izradu rastera visina (DEM) i mape nagiba:
   - Koristiti alat **Raster → Analysis → Slope** ili **Processing Toolbox → TIN Interpolation**.
   - Klasifikovati nagibe u 3 pojasa: `< 5 %` (zeleno), `5–8,3 %` (žuto), `> 8,3 %` (crveno).

### B. AutoCAD / Civil 3D / Revit
1. Format tačaka za uvoz: `P,N,E,Z` ili `X,Y,Z`.
2. Izabrati kolone `X`, `Y`, `Elevation` iz `zivimo zajedno_Visine.csv`.
3. U Revit-u: **Massing & Site → Toposurface → Create from Import → Specify Points File** i izabrati CSV.

---

## 4. Ključna geometrijska ograničenja lokacije

- **Visinska razlika:** 22,5 m na vazdušnoj liniji od 151 m (prosečan nagib 14,9%).
- **Lokalni pad:** Na najstrmijim deonicama izmereno i do 63 % (32°).
- **Zadatak:** Izvesti jedinstvenu pristupačnu trasu (nagib rampe ≤ 5 %, izuzetno do 8,3 % uz odmorišta) koja savladava visinu i omogućava ravnopravno kretanje bez odvajanja korisnika.
