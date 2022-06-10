const dayjs = require("dayjs");
const { CarAlreadyRentedError } = require("../../app/errors");
const { CarController } = require("../../app/controllers");
const { Car, UserCar } = require("../../app/models");


describe("Cars unit test", () => {

    const carModel = Car;
    const userCarModel = UserCar;
    const carController = new CarController({ carModel, userCarModel, dayjs });

    describe('Successful Operation', () => {

        describe('handleListCars', () => {
            it('should returning status code 200 and with all cars and meta pagging', async () => {
                const mReq = { query: { pageSize: 10 } }
                const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() }
                const mNext = jest.fn()
                await carController.handleListCars(mReq, mRes, mNext)

                expect(mRes.status).toBeCalledWith(200)
            })
        })

        describe('handleGetCar', () => {
            it('should returning status OK code 200 and return one car', async () => {
                const mReq = { params: { id: 1 } }
                const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() }
                const mNext = jest.fn()
                await carController.handleGetCar(mReq, mRes, mNext)

                expect(mRes.status).toBeCalledWith(200)
            })
        })

        describe('handleCreateCar', () => {
            it('should be returning status code 201 and return the new created car', async () => {
                const mReq = { body: { name: "testing 1", price: 125000, size: "SMALL", image: "https://source.unsplash.com/531x531" } }
                const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() }
                const mNext = jest.fn()
                await carController.handleCreateCar(mReq, mRes, mNext)

                expect(mRes.status).toBeCalledWith(201)
            })
        })

        describe('handleRentCar', () => {
            const today = new Date()
            const tomorrow = new Date(today)
            tomorrow.setDate(tomorrow.getDate() + 1)

            it('should be returning status code 201 and return the rented car', async () => {
                const mReq = { params: { id: 2 }, user: { id: 2 }, body: { rentStartedAt: today, rentEndedAt: tomorrow, } }
                const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() }
                const mNext = jest.fn()
                await carController.handleRentCar(mReq, mRes, mNext)

                expect(mRes.status).toBeCalledWith(201)
            })
        })

        describe('handleUpdateCar', () => {
            it('should be returning status code 200 and return the new updated car', async () => {
                const mReq = { params: { id: 2 }, body: { name: "testing 1", price: 125000, size: "SMALL", image: "https://source.unsplash.com/531x531" } }
                const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() }
                const mNext = jest.fn()
                await carController.handleUpdateCar(mReq, mRes, mNext)

                expect(mRes.status).toBeCalledWith(200)
            })
        })

        describe('handleDeleteCar', () => {
            it('should be returning status code 204 and return the deleted car', async () => {
                const newCar = await carModel.create({
                    name: "testing 1",
                    price: 125000,
                    size: "SMALL",
                    image: "https://source.unsplash.com/531x531"
                })
                const mReq = { params: { id: newCar.id } }
                const mRes = { status: jest.fn().mockReturnThis(), end: jest.fn().mockReturnThis() }
                const mNext = jest.fn()
                await carController.handleDeleteCar(mReq, mRes, mNext)

                expect(mRes.status).toBeCalledWith(204)
            })
        })

    })

    describe('Error Operation', () => {

        describe('handleRentCar', () => {
            const today = new Date()
            const tomorrow = new Date(today)
            tomorrow.setDate(tomorrow.getDate() + 1)

            it('should be returning status code 422 and error car already rented', async () => {
                const mReq = { params: { id: 2 }, user: { id: 2 }, body: { rentStartedAt: today, rentEndedAt: tomorrow, } }
                const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() }
                const mNext = jest.fn()
                await carController.handleRentCar(mReq, mRes, mNext)

                const mReq2 = { params: { id: 2 }, user: { id: 2 }, body: { rentStartedAt: today, rentEndedAt: tomorrow, } }
                const mRes2 = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() }
                const mNext2 = jest.fn()
                await carController.handleRentCar(mReq2, mRes2, mNext2)

                const car = await carModel.findByPk(mReq2.params.id)
                const expectedError = new CarAlreadyRentedError(car)
                expect(mRes2.status).toBeCalledWith(422)
                expect(mRes2.json).toBeCalledWith(expectedError)
            })
        })

        describe('handleUpdateCar', () => {
            it('should be returning status code 200 and return the new updated car', async () => {
                const mReq = { params: { id: 0 }, body: { name: "testing 1", price: 125000, size: "SMALL", image: "https://source.unsplash.com/531x531" } }
                const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() }
                const mNext = jest.fn()
                await carController.handleUpdateCar(mReq, mRes, mNext)

                const expectedError = { error: { name: "TypeError", message: "Cannot read properties of null (reading 'update')", } }
                expect(mRes.status).toBeCalledWith(422)
                expect(mRes.json).toBeCalledWith(expectedError)
            })
        })

        describe('getCarFromRequest', () => {
            it('no id should return error Cannot read properties of undefined', async () => {
                const expectedError = new TypeError("Cannot read properties of undefined (reading 'params')")
                const func = () => {
                    try {
                        carController.getCarFromRequest()
                    } catch (err) {
                        throw err
                    }
                }
                expect(func).toThrow(expectedError)
            })
        })

        describe('getListQueryFromRequest', () => {
            it('no query should return error Cannot read properties of undefined', async () => {
                const expectedError = new TypeError("Cannot read properties of undefined (reading 'query')")
                const func = () => {
                    try {
                        carController.getListQueryFromRequest()
                    } catch (err) {
                        throw err
                    }
                }
                expect(func).toThrow(expectedError)
            })
        })

    })
})