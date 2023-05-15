import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import passport from 'passport';
import { passportfN } from './midleware/passport';
import { ROUTES } from './routes';
import multer from 'multer';
import cookieParser from 'cookie-parser'
import { upload } from './midleware/multer';
    
const PORT = process.env.PORT || 4001

const app = express()
app.use(cors({
    credentials: true,
    origin: "http://localhost:3000"
}));


// dotenv.config({path: '../.env'})
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(cookieParser());
upload
ROUTES.map(router=>{
    return app.use(`/api${router.path}`, router.router);
})

app.use(passport.initialize());
passportfN(passport)

app.use((req: Request, res: Response) => {
    res.status(404).send("<h1>ERROR 404 <br/> PAGE NOT FOUND</h1>")
})

async function start() {
    try {
        app.listen(PORT, () => {
            console.log("RUNNING ON PORT 4001");
        })
    } catch (e) {
        console.log(e);
    }
}

start()