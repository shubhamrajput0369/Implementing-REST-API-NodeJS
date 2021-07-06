const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
    {id: 1, name: 'REST API'},
    {id: 2, name: 'XML'},
    {id: 3, name: 'JavaScript'} 
];

app.get('/', (req, res) => {
    res.send('Hello Word!!!!!');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The requested course ID is not exist');
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    //Look for the ID
    //If ID doesn't exist then return 404 error
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The requested course ID is not exist');

    //Validate 
    //If invalid then return error 400 Bad Request
    const { error } = validateCourse(req.body);     //result.error (Object Destructor)
    if(error) return res.status(400).send(error.details[0].message);
        

    //if parameters are correct then Update the details
    //return the response with modified object
    course.name = req.body.name;
    res.send(course);
});

function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
}

app.post('/api/courses', (req, res) => {
    const {error} = validateCourse(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.delete('/api/courses/:id', (req, res) =>{
    //Look for ID
    //If doesn't exist then return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The requested course ID is not exist');

    //Delete ID
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    //return deleted ID
    res.send(course);
});


//PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening to port ${port}.....`));
