import { randomUUID } from 'crypto';
import mongoose from 'mongoose';
import request from 'supertest';

// ExpressJs
import app from '../index'

jest.setTimeout(60000)

const correctCredentials = {
    name: 'User Test',
    email: 'usertest32usertest@text.com',
    password: 'user-test123',
    'token-notification': 'qindfasfbsdifbsdfuhsvufhsvufvasfdbpiasvfivasdfvasfipd',
    image: __dirname + '/image.jpg',
    _id: 'usertest'
}

const wrongCredentials = {
    name: 'User',
    email: 'usertest@text.com',
    password: 'user-te',
    'token-notification': 'dsffdgdfsjsdnfiasid',
    image: __dirname + '/image.jpg',
    _id: 'usertest'
}

describe('POST /user/register', () => {
    // Delete the user before execute tests
    beforeAll(async () => {
        await request(app).delete('/user/' + correctCredentials._id);
    })

    it('response status has to be equal 200 where create user with success', async () => {
        const response = await request(app).post('/user/register').
            field('name', correctCredentials.name).
            field('email', correctCredentials.email).
            field('password', correctCredentials.password).
            field('token-notification', correctCredentials['token-notification']).
            attach('image', correctCredentials.image)

        expect(response.status).toBe(201)
    })

    it('return status 404 where user already exists', async () => {
        const response = await request(app).post('/user/register').
            field('name', correctCredentials.name).
            field('email', correctCredentials.email).
            field('password', correctCredentials.password).
            field('token-notification', correctCredentials['token-notification']).
            attach('image', correctCredentials.image)

        expect(response.status).toBe(404)
        expect(response.body).toEqual({ status: 'error', message: 'user already exist' })

    })

    it('response status has to be equal 404 where name user is invalid', async () => {
        const response = await request(app).post('/user/register').
            field('name', wrongCredentials.name).
            field('email', correctCredentials.email).
            field('password', correctCredentials.password).
            field('token-notification', correctCredentials['token-notification']).
            attach('image', correctCredentials.image)

        expect(response.status).toBe(404)
        expect(response.body).toEqual({ status: 'error', message: 'name is less than 4' })
    })

    it('response status has to be equal 404 where email user is invalid', async () => {
        const response = await request(app).post('/user/register').
            field('name', correctCredentials.name).
            field('email', wrongCredentials.email).
            field('password', correctCredentials.password).
            field('token-notification', correctCredentials['token-notification']).
            attach('image', correctCredentials.image)

        expect(response.status).toBe(404)
        expect(response.body).toEqual({ status: 'error', message: 'email is less than 20' })
    })

    it('response status has to be equal 404 where password user is invalid', async () => {
        const response = await request(app).post('/user/register').
            field('name', correctCredentials.name).
            field('email', correctCredentials.email).
            field('password', wrongCredentials.password).
            field('token-notification', correctCredentials['token-notification']).
            attach('image', correctCredentials.image)

        expect(response.status).toBe(404)
        expect(response.body).toEqual({ status: 'error', message: 'password is less than 11' })

    })

    it('response status has to be equal 404 where token-notification user is invalid', async () => {
        const response = await request(app).post('/user/register').
            field('name', correctCredentials.name).
            field('email', correctCredentials.email).
            field('password', correctCredentials.password).
            field('token-notification', wrongCredentials['token-notification']).
            attach('image', correctCredentials.image)

        expect(response.status).toBe(404)
        expect(response.body).toEqual({ status: 'error', message: 'token-notification is less than 48' })
    })
})

describe('POST /user/login', () => {
    it('response status has to be equal 200 where user logged with success', async () => {
        const response = await request(app).post('/user/login').send({
            'token-notification': correctCredentials['token-notification'],
            email: correctCredentials.email,
            password: correctCredentials.password
        })
        expect(response.status).toBe(200)
    })

    it('response status has to be equal 401 where password user not is equal', async () => {
        const response = await request(app).post('/user/login').send({
            'token-notification': correctCredentials['token-notification'],
            email: correctCredentials.email,
            password: 'efgsfg1209dcs.ax'
        })
        expect(response.status).toBe(401)
        expect(response.body).toEqual({ status: 'error', message: 'password is wrong' })
    })

    it('return error where try login with not existent user', async () => {
        const response = await request(app).post('/user/login').send({
            'token-notification': correctCredentials['token-notification'],
            email: 'wrongCredentials.email@gmail.com',
            password: correctCredentials.password
        })
        expect(response.status).toBe(404)
        expect(response.body).toEqual({ status: 'error', message: 'user not exists' })
    })
})

describe('GET /user/:id', () => {
    it('response status has to be equal 200 where get user with success', async () => {
        const response = await request(app).get('/user/' + correctCredentials._id);
        expect(response.status).toBe(200)
    })

    it('response status has to be equal 404 where user not exists', async () => {
        const response = await request(app).get('/user/' + randomUUID());
        expect(response.status).toBe(404)
        expect(response.body).toEqual({ status: 'error', message: 'user not found' })
    })
})

describe('PUT /user/:id', () => {
    it('response status has to be equal 200 where updated user was a success', async () => {
        const response = await request(app).put('/user/' + correctCredentials._id).send({
            name: 'usertest2',
            'token-notification': 'osdfnoasfdjbdsjifbisdbfibihjsdfbihjasbdfhuasbdufoasdnfosdnjfd'
        })
        expect(response.status).toBe(200)
    })

    it('response status has to be equal 404 where id user is null', async () => {
        const response = await request(app).put('/user/');
        expect(response.status).toBe(404)
    })

    it('response status has to be equal 404 where name user is invalid', async () => {
        const response = await request(app).put('/user/' + correctCredentials._id).send({
            name: wrongCredentials.name,
            'token-notification': 'osdfnoasfdjbdsjifbisdbfibihjsdfbihjasbdfhuasbdufoasdnfosdnjfd'
        })
        expect(response.status).toBe(404)
    })

    it('response status has to be equal 404 where token-notification user is invalid', async () => {
        const response = await request(app).put('/user/' + correctCredentials._id).send({
            name: 'usertest2',
            'token-notification': wrongCredentials['token-notification']
        })
        expect(response.status).toBe(404)
    })
})

describe('DELETE /user/:id', () => {
    it('response status has to be equal 200 where delete user with success', async () => {
        const response = await request(app).delete('/user/' + correctCredentials._id);
        expect(response.status).toBe(200)
    })

    it('response status has to be equal 404 where user not exists', async () => {
        const response = await request(app).delete('/user/' + correctCredentials._id);
        expect(response.status).toBe(400)
    })
})

app.close();
(async () => {
    await mongoose.connection.close()
})()