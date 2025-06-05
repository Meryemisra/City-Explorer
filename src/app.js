require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// Supabase client setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', async (req, res) => {
    const { data: cities, error } = await supabase
        .from('cities')
        .select('*')
        .order('name');

    if (error) {
        console.error('Error fetching cities:', error);
        return res.status(500).send('Error fetching cities');
    }

    res.render('index', {
        cities,
        user: req.session.user || null
    });
});

// Auth routes
app.post('/register', async (req, res) => {
    const { email, password, username } = req.body;

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                username
            }
        }
    });

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.redirect('/login');
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    req.session.user = data.user;
    res.redirect('/');
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// City routes
app.post('/cities', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name, description, country } = req.body;

    const { data, error } = await supabase
        .from('cities')
        .insert([{ name, description, country, user_id: req.session.user.id }]);

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.redirect('/');
});

// Places routes
app.post('/places', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name, description, city_id, address } = req.body;

    const { data, error } = await supabase
        .from('places')
        .insert([{
            name,
            description,
            city_id,
            address,
            user_id: req.session.user.id
        }]);

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.redirect(`/cities/${city_id}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 