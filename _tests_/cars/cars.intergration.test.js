const app = require('../../app')
const request = require("supertest")


describe("Cars intergration test", () => {

    describe('Successful Operation', () => {
        describe('GET /v1/cars', () => {
            it('should returning status code 200 and with all cars and meta pagging', (done) => {
                request(app)
                    .get("/v1/cars")
                    .set('accept', 'application/json')
                    .expect("content-type", /json/)
                    .expect(200, done)
            })
        })

        describe('GET /v1/cars/1', () => {
            it('should returning status OK code 200 and return one car', (done) => {
                request(app)
                    .get("/v1/cars/1")
                    .set('accept', 'application/json')
                    .expect("content-type", /json/)
                    .expect(200, done)
            })
        })

        describe('POST /v1/cars', () => {
            let token
            const credentials = {
                email: "johnny@binar.co.id",
                password: "123456"
            }
            beforeAll((done) => {
                request(app)
                    .post("/v1/auth/login")
                    .send(credentials)
                    .end((err, res) => {
                        token = res.body.accessToken
                        done()
                    })
            })
            it('should be returning status code 201 and return the new created car', (done) => {
                const newCar = {
                    name: "testing 1",
                    price: 125000,
                    size: "SMALL",
                    image: "https://source.unsplash.com/531x531"
                }

                request(app)
                    .post('/v1/cars')
                    .set("Authorization", `Bearer ${token}`)
                    .send(newCar)
                    .expect(201)
                    .then(res => {
                        expect(res.body.name).toEqual(newCar.name)
                        expect(res.body.price).toEqual(newCar.price)
                        expect(res.body.size).toEqual(newCar.size)
                        expect(res.body.image).toEqual(newCar.image)
                        done()
                    })
            })
        })

        describe('POST /v1/cars/1/rent', () => {
            let token
            const credentials = {
                email: "brian@binar.co.id",
                password: "123456"
            }
            beforeAll((done) => {
                request(app)
                    .post("/v1/auth/login")
                    .send(credentials)
                    .end((err, res) => {
                        token = res.body.accessToken
                        done()
                    })
            })
            it('should be returning status code 201 and return the rented car', (done) => {
                const today = new Date()
                const tomorrow = new Date(today)
                tomorrow.setDate(tomorrow.getDate() + 1)

                const rentCar = {
                    rentStartedAt: today,
                    rentEndedAt: tomorrow,
                }

                request(app)
                    .post('/v1/cars/1/rent')
                    .set("Authorization", `Bearer ${token}`)
                    .send(rentCar)
                    .expect(201)
                    .then(res => {
                        expect(new Date(res.body.rentStartedAt)).toEqual(new Date(rentCar.rentStartedAt))
                        expect(new Date(res.body.rentEndedAt)).toEqual(new Date(rentCar.rentEndedAt))
                        done()
                    })
            })
        })

        describe('PUT /v1/cars/1', () => {
            let token
            const credentials = {
                email: "johnny@binar.co.id",
                password: "123456"
            }
            beforeAll((done) => {
                request(app)
                    .post("/v1/auth/login")
                    .send(credentials)
                    .end((err, res) => {
                        token = res.body.accessToken
                        done()
                    })
            })
            it('should be returning status code 200 and return the new updated car', (done) => {
                const updateCar = {
                    name: "testing 1",
                    price: 135000,
                    size: "LARGE",
                    image: "https://source.unsplash.com/531x531"
                }

                request(app)
                    .put('/v1/cars/1')
                    .set("Authorization", `Bearer ${token}`)
                    .send(updateCar)
                    .expect(200)
                    .then(res => {
                        expect(res.body.name).toEqual(updateCar.name)
                        expect(res.body.price).toEqual(updateCar.price)
                        expect(res.body.size).toEqual(updateCar.size)
                        expect(res.body.image).toEqual(updateCar.image)
                        done()
                    })
            })
        })

        describe('delete /v1/cars/1', () => {
            let token
            const credentials = {
                email: "johnny@binar.co.id",
                password: "123456"
            }
            beforeAll((done) => {
                request(app)
                    .post("/v1/auth/login")
                    .send(credentials)
                    .end((err, res) => {
                        token = res.body.accessToken
                        done()
                    })
            })
            it('should be returning status code 204 and return the deleted car', (done) => {
                const newCar = {
                    name: "testing 1",
                    price: 125000,
                    size: "SMALL",
                    image: "https://source.unsplash.com/531x531"
                }
                request(app)
                    .post('/v1/cars')
                    .set("Authorization", `Bearer ${token}`)
                    .send(newCar)
                    .then(res => {
                        const id = res.body.id
                        request(app)
                            .delete(`/v1/cars/${id}`)
                            .set("Authorization", `Bearer ${token}`)
                            .expect(204, done)
                    })
            })
        })

    })

    describe('Error Operation', () => {

        describe('POST /v1/cars/0/rent', () => {
            let token
            const credentials = {
                email: "brian@binar.co.id",
                password: "123456"
            }
            beforeAll((done) => {
                request(app)
                    .post("/v1/auth/login")
                    .send(credentials)
                    .end((err, res) => {
                        token = res.body.accessToken
                        done()
                    })
            })
            it('should be returning status code 500 and error car id', (done) => {

                request(app)
                    .post('/v1/cars/0/rent')
                    .set("Authorization", `Bearer ${token}`)
                    .expect(500, done)
            })
        })

        describe('POST /v1/cars/2/rent', () => {
            let token
            const credentials = {
                email: "brian@binar.co.id",
                password: "123456"
            }
            beforeAll((done) => {
                request(app)
                    .post("/v1/auth/login")
                    .send(credentials)
                    .end((err, res) => {
                        token = res.body.accessToken
                        done()
                    })
            })
            it('should be returning status code 422 and error car already rented', (done) => {
                const today = new Date()
                const tomorrow = new Date(today)
                tomorrow.setDate(tomorrow.getDate() + 1)

                const rentCar = {
                    rentStartedAt: today,
                    rentEndedAt: tomorrow,
                }

                request(app)
                    .post('/v1/cars/2/rent')
                    .set("Authorization", `Bearer ${token}`)
                    .send(rentCar)
                    .end(() => {
                        request(app)
                            .post('/v1/cars/2/rent')
                            .set("Authorization", `Bearer ${token}`)
                            .send(rentCar)
                            .expect(422, done)
                    })
            })
        })

        describe('PUT /v1/cars/0', () => {
            let token
            const credentials = {
                email: "johnny@binar.co.id",
                password: "123456"
            }
            beforeAll((done) => {
                request(app)
                    .post("/v1/auth/login")
                    .send(credentials)
                    .end((err, res) => {
                        token = res.body.accessToken
                        done()
                    })
            })
            it('should be returning status code 422 and error car id', (done) => {

                request(app)
                    .put('/v1/cars/0')
                    .set("Authorization", `Bearer ${token}`)
                    .expect(422, done)
            })
        })

    })
})