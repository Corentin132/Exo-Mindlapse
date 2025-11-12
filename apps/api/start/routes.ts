/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/AuthController'
import ProductsController from '#controllers/ProductsController'
import { middleware } from '#start/kernel'
const authController = new AuthController()
const productsController = new ProductsController()

router.get('/', () => ({ status: 'ok' }))

router
  .group(() => {
    router.post('/login', (ctx) => authController.login(ctx))
    router.post('/register', (ctx) => authController.register(ctx))
    router.post('/logout', (ctx) => authController.logout(ctx))
    router
      .group(() => {
        router.get('/products', (ctx) => productsController.index(ctx))
        router.post('/products', (ctx) => productsController.store(ctx))
        router.get('/products/:id', (ctx) => productsController.show(ctx))
        router.put('/products/:id', (ctx) => productsController.update(ctx))
        router.delete('/products/:id', (ctx) => productsController.destroy(ctx))
      })
      .middleware(middleware.auth())
  })
  .prefix('/api')
