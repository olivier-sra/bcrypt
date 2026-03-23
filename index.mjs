import express from 'express';
const planets = (await import('npm-solarsystem')).default;

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

//routes
//root route
app.get('/', async(req, res) => {
    let randomImageResponse = await fetch('https://pixabay.com/api/?key=20426927-497d14db9c234faf7d0df8317&per_page=50&orientation=horizontal&q=solar%20system');
    let randomImageData = await randomImageResponse.json();

    let random = Math.random() * 49;
    let randomImage = randomImageData.hits[Math.floor(random)];
    let randomImageURL = randomImage.webformatURL;

    res.render('home.ejs', { image: randomImageURL }, );
});

app.get('/planetInfo', (req, res) => {
   let planet = req.query.planet;
   let planetInfo = planets[`get${planet}`]();
   res.render('planet.ejs', {planetInfo, planet});
});

app.get('/others', (req, res) => {
   let type = req.query.type;
   let info = planets[`get${type}`]();
   res.render('others.ejs', {info, type});
});

app.get('/apodInfo',async(req,res)=>{
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    let apod = await fetch(`https://api.nasa.gov/planetary/apod?api_key=9mUzIkhlZCZaOoMfspg7jMmwZCZ4LiRHtkgkambD&date=${today}`);
    let apodData = await apod.json();
    if (apodData.media_type === 'video') {
        apod = await fetch(`https://api.nasa.gov/planetary/apod?api_key=9mUzIkhlZCZaOoMfspg7jMmwZCZ4LiRHtkgkambD&date=${yesterday}`);
        apodData = await apod.json();
    }
    let apodImg = apodData.url;
    res.render('apod.ejs', {apodImg});
})

app.listen(3000, () => {
   console.log('server started');
});