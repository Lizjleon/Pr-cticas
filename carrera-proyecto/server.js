const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');

const app = express();
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({secret:'secret123', resave:false, saveUninitialized:false}));
app.use(flash());

const dbConfig = { host:'localhost', user:'root', password:'', database:'carrera_db' };

async function getConnection(){ return await mysql.createConnection(dbConfig); }

app.use((req,res,next)=>{
  res.locals.user = req.session.user || null;
  res.locals.admin = req.session.admin || null;
  res.locals.messages = req.flash();
  next();
});

// ---------------- Rutas ----------------

app.get('/', async (req,res)=>{
  res.render('index');
});

app.get('/register',(req,res)=>{
  if (req.session.user) return res.redirect('/profile');
  if (req.session.admin) return res.redirect('/admin');
  res.render('register');
});

app.post('/register', async (req,res)=>{

  if (req.session.user || req.session.admin) {
    req.flash('error','Ya has iniciado sesión. Cierra sesión para inscribirte con otro usuario.');
    return res.redirect('/');
  }
  try{
    const {nombre,apellidos,dni,telefono,calle,numero,poblacion,cp,password} = req.body;
    const hashed = await bcrypt.hash(password,10);
    const conn = await getConnection();
    const [result] = await conn.execute(
      `INSERT INTO participants (nombre,apellidos,dni,telefono,calle,numero,poblacion,cp,password) VALUES (?,?,?,?,?,?,?,?,?)`,
      [nombre,apellidos,dni,telefono,calle,numero,poblacion,cp,hashed]
    );
    await conn.end();
    const dorsal = result.insertId;
    res.render('confirm',{dorsal});
  }catch(err){
    console.error(err);
    req.flash('error','Error al registrar. Comprueba los datos (DNI único).');
    res.redirect('/register');
  }
});

app.get('/confirm',(req,res)=> res.render('confirm',{dorsal:null}));

app.get('/login',(req,res)=>{
  if (req.session.user) return res.redirect('/profile');
  if (req.session.admin) return res.redirect('/admin');
  res.render('login');
});

app.post('/login', async (req,res)=>{
  const {dni,password} = req.body;
  try{
    const conn = await getConnection();
    const [rows] = await conn.execute(`SELECT * FROM participants WHERE dni = ?`, [dni]);
    await conn.end();
    if(rows.length===0){ req.flash('error','DNI no registrado'); return res.redirect('/login'); }
    const p = rows[0];
    const ok = await bcrypt.compare(password, p.password);
    if(!ok){ req.flash('error','Contraseña incorrecta'); return res.redirect('/login'); }
    req.session.user = {id:p.id,nombre:p.nombre,dni:p.dni};
    res.redirect('/profile');
  }catch(e){ console.error(e); req.flash('error','Error en login'); res.redirect('/login'); }
});

app.get('/profile', async (req,res)=>{
  if(!req.session.user) return res.redirect('/login');
  const conn = await getConnection();
  const [rows] = await conn.execute(`SELECT id,nombre,apellidos,dni,telefono,calle,numero,poblacion,cp FROM participants WHERE id = ?`, [req.session.user.id]);
  await conn.end();
  res.render('profile',{p: rows[0]});
});

app.post('/profile', async (req,res)=>{
  if(!req.session.user) return res.redirect('/login');
  const {nombre,apellidos,telefono,calle,numero,poblacion,cp,password} = req.body;
  try{
    const conn = await getConnection();
    if(password && password.trim() !== ''){
      const hashed = await bcrypt.hash(password,10);
      await conn.execute(`UPDATE participants SET nombre=?,apellidos=?,telefono=?,calle=?,numero=?,poblacion=?,cp=?,password=? WHERE id=?`,
        [nombre,apellidos,telefono,calle,numero,poblacion,cp,hashed, req.session.user.id]);
    }else{
      await conn.execute(`UPDATE participants SET nombre=?,apellidos=?,telefono,calle=?,numero=?,poblacion=?,cp=? WHERE id=?`,
        [nombre,apellidos,telefono,calle,numero,poblacion,cp, req.session.user.id]);
    }
    await conn.end();
    req.flash('success','Datos actualizados');
    res.redirect('/profile');
  }catch(e){ console.error(e); req.flash('error','Error actualizando'); res.redirect('/profile'); }
});

app.get('/logout',(req,res)=>{ req.session.destroy(()=>res.redirect('/')); });

app.get('/info', async (req,res)=>{
  const conn = await getConnection();
  const [[{count}]] = await conn.query(`SELECT COUNT(*) as count FROM participants`);
  const [winners] = await conn.query(`SELECT w.posicion, p.nombre, p.apellidos, p.id FROM winners w LEFT JOIN participants p ON w.participant_id = p.id ORDER BY w.posicion ASC`);
  await conn.end();
  res.render('info',{count,count2:count,winners});
});

async function ensureAdmin(){
  try{
    const conn = await getConnection();
    await conn.execute(`CREATE TABLE IF NOT EXISTS admins (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(50) UNIQUE, password VARCHAR(255))`);
    const [rows] = await conn.execute(`SELECT * FROM admins WHERE username = 'admin'`);
    if(rows.length===0){
      const hashed = await bcrypt.hash('admin123',10);
      await conn.execute(`INSERT INTO admins (username,password) VALUES (?,?)`, ['admin', hashed]);
      console.log('Usuario admin creado: usuario=admin contraseña=admin123');
    }
    await conn.end();
  }catch(e){ console.error('Error ensureAdmin',e); }
}
ensureAdmin();

app.get('/admin/login',(req,res)=>{
  if (req.session.admin) return res.redirect('/admin');
  if (req.session.user) return res.redirect('/profile'); 
  res.render('admin_login');
});

app.post('/admin/login', async (req,res)=>{
  const {username,password} = req.body;
  try{
    const conn = await getConnection();
    const [rows] = await conn.execute(`SELECT * FROM admins WHERE username = ?`, [username]);
    await conn.end();
    if(rows.length===0){ req.flash('error','Admin no encontrado'); return res.redirect('/admin/login'); }
    const ok = await bcrypt.compare(password, rows[0].password);
    if(!ok){ req.flash('error','Contraseña admin incorrecta'); return res.redirect('/admin/login'); }
    req.session.admin = {username};
    res.redirect('/admin');
  }catch(e){ console.error(e); req.flash('error','Error admin login'); res.redirect('/admin/login'); }
});

app.get('/admin', async (req,res)=>{
  if(!req.session.admin) return res.redirect('/admin/login');
  const conn = await getConnection();
  const [parts] = await conn.query(`SELECT * FROM participants ORDER BY id DESC`);
  const [winners] = await conn.query(`SELECT w.posicion, p.nombre, p.apellidos, p.id FROM winners w LEFT JOIN participants p ON w.participant_id = p.id ORDER BY w.posicion ASC`);
  await conn.end();
  res.render('admin',{parts,winners});
});

app.post('/admin/delete/:id', async (req,res)=>{
  if(!req.session.admin) return res.redirect('/admin/login');
  const id = req.params.id;
  const conn = await getConnection();
  await conn.execute(`DELETE FROM participants WHERE id = ?`, [id]);
  await conn.end();
  req.flash('success','Participante borrado');
  res.redirect('/admin');
});

app.post('/admin/winner', async (req,res)=>{
  if(!req.session.admin) return res.redirect('/admin/login');
  const {participant_id,posicion} = req.body;
  const conn = await getConnection();
  await conn.execute(`DELETE FROM winners WHERE posicion = ?`, [posicion]);
  await conn.execute(`INSERT INTO winners (participant_id,posicion) VALUES (?,?)`, [participant_id,posicion]);
  await conn.end();
  req.flash('success','Ganador registrado');
  res.redirect('/admin');
});

app.get('/admin/edit/:id', async (req,res)=>{
  if(!req.session.admin) return res.redirect('/admin/login');
  const id = req.params.id;
  const conn = await getConnection();
  const [rows] = await conn.execute(`SELECT id,nombre,apellidos,dni,telefono,calle,numero,poblacion,cp FROM participants WHERE id = ?`, [id]);
  await conn.end();
  res.render('admin_edit',{p:rows[0]});
});

app.post('/admin/edit/:id', async (req,res)=>{
  if(!req.session.admin) return res.redirect('/admin/login');
  const id = req.params.id;
  const {nombre,apellidos,telefono,calle,numero,poblacion,cp} = req.body;
  const conn = await getConnection();
  await conn.execute(`UPDATE participants SET nombre=?,apellidos=?,telefono=?,calle=?,numero=?,poblacion=?,cp=? WHERE id = ?`, [nombre,apellidos,telefono,calle,numero,poblacion,cp,id]);
  await conn.end();
  req.flash('success','Participante actualizado');
  res.redirect('/admin');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log('Server running on http://localhost:'+PORT));
