const models = require("../../app/models")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { EmailNotRegisteredError, EmailAlreadyTakenError, InsufficientAccessError, RecordNotFoundError, WrongPasswordError } = require("../../app/errors");
const { AuthenticationController} = require("../../app/controllers");
const { User, Role, Car, UserCar } = require("../../app/models");


describe("Auth unit test", () => {

    const roleModel = Role;
    const userModel = User;
    const authenticationController = new AuthenticationController({ bcrypt, jwt, roleModel, userModel, });


    describe('Successful Operation', () => {

        describe('handleLogin', () => {
            it('should be returning status code 201 and return the acess token', async () => {
                const mReq = { body: { email: "johnny@binar.co.id", password: "123456" } }
                const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() }
                const mNext = jest.fn()
                await authenticationController.handleLogin(mReq, mRes, mNext)

                expect(mRes.status).toBeCalledWith(201)
            })
        })

        describe('handleRegister', () => {
            it('should be returning status code 201 and return the new created user', async () => {
                const mReq = { body: { name: "testing6", email: "testing6@binar.co.id", password: "123456" } }
                const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() }
                const mNext = jest.fn()
                await authenticationController.handleRegister(mReq, mRes, mNext)

                expect(mRes.status).toBeCalledWith(201)
                models.User.destroy({ where: { name: "testing6", email: "testing6@binar.co.id" } })
            })
        })

        describe('handleGetUser', () => {
            it('should returning status code 200 and return the current user', async () => {
                const mReq = { user: { id: 1 } }
                const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() }
                const mNext = jest.fn()
                await authenticationController.handleGetUser(mReq, mRes, mNext)

                expect(mRes.status).toBeCalledWith(200)
            })
        })

    })

    describe('Error Operation', () => {

        describe('handleLogin', () => {
            it('should be returning status code 404 and error email not registered', async () => {
                const mReq = { body: { email: 'johny@binar.co.id', password: '123456' } }
                const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() }
                const mNext = jest.fn()
                await authenticationController.handleLogin(mReq, mRes, mNext)

                const expectedError = new EmailNotRegisteredError(mReq.body.email)
                expect(mRes.status).toBeCalledWith(404)
                expect(mRes.json).toBeCalledWith(expectedError)
            })
        })

        describe('handleLogin', () => {
            it('should be returning status code 401 and error wrong password', async () => {
                const mReq = { body: { email: 'johnny@binar.co.id', password: '12345' } }
                const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() }
                const mNext = jest.fn()
                await authenticationController.handleLogin(mReq, mRes, mNext)

                const expectedError = new WrongPasswordError()
                expect(mRes.status).toBeCalledWith(401)
                expect(mRes.json).toBeCalledWith(expectedError)
            })
        })

        describe('handleLogin', () => {
            it('should be returning status code 500 and internal server error ', async () => {
                const mReq = { body: {} }
                const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() }
                const mNext = jest.fn()
                await authenticationController.handleLogin(mReq, mRes, mNext)

                expect(mNext).toHaveBeenCalled()
            })
        })

        describe('handleRegister', () => {
            it('should be returning status code 422 and email already taken', async () => {
                const mReq = { body: { email: 'johnny@binar.co.id', password: '123456' } }
                const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() }
                const mNext = jest.fn()
                await authenticationController.handleRegister(mReq, mRes, mNext)

                const expectedError = new EmailAlreadyTakenError(mReq.body.email)
                expect(mRes.status).toBeCalledWith(422)
                expect(mRes.json).toBeCalledWith(expectedError)
            })
        })

        describe('handleRegister', () => {
            it('should be returning status code 500 and internal server error ', async () => {
                const mReq = { body: {} }
                const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() }
                const mNext = jest.fn()
                await authenticationController.handleRegister(mReq, mRes, mNext)

                expect(mNext).toHaveBeenCalled()
            })
        })

        describe('handleGetUser', () => {
            it('should be returning status code 404 and error record not found', async () => {
                const mReq = { user: { id: "0" } }
                const mRes = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() }
                const mNext = jest.fn()
                await authenticationController.handleGetUser(mReq, mRes, mNext)

                const expectedError = new RecordNotFoundError()
                expect(mRes.status).toBeCalledWith(404)
                expect(mRes.json).toBeCalledWith(expectedError)
            })
        })

        describe('createTokenFromUser', () => {
            it('no user should return error Cannot read properties of undefined', async () => {
                const expectedError = new TypeError("Cannot read properties of undefined (reading 'id')")
                const func = () => {
                    try {
                        authenticationController.createTokenFromUser()
                    } catch (err) {
                        throw err
                    }
                }
                expect(func).toThrow(expectedError)
            })
        })

        describe('decodeToken', () => {
            it('no token should return error JsonWebTokenError', async () => {
                const expectedError = new jwt.JsonWebTokenError('jwt must be provided')
                const func = () => {
                    try {
                        authenticationController.decodeToken()
                    } catch (err) {
                        throw err
                    }
                }
                expect(func).toThrow(expectedError)
            })
        })

        describe('encryptPassword', () => {
            it('no password should return error illegal arguments', async () => {
                const expectedError = new Error("Illegal arguments: undefined, string")
                const func = () => {
                    try {
                        authenticationController.encryptPassword()
                    } catch (err) {
                        throw err
                    }
                }
                expect(func).toThrow(expectedError)
            })
        })

        describe('verifyPassword', () => {
            it('no password and no encrypted password should return error illegal arguments', async () => {
                const expectedError = new Error("Illegal arguments: undefined, undefined")
                const func = () => {
                    try {
                        authenticationController.verifyPassword()
                    } catch (err) {
                        throw err
                    }
                }
                expect(func).toThrow(expectedError)
            })
        })


    })

})
