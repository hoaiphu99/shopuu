import productRoutes from './productRoutes.js'
import userRoutes from './userRoutes.js'
import orderRoutes from './orderRoutes.js'
import uploadRoutes from './uploadRoutes.js'
import categoryRoutes from './categoryRoutes.js'
import brandRoutes from './brandRoutes.js'
import cartRoutes from './cartRoutes.js'

const route = (app) => {
  app.use('/api/products', productRoutes)
  app.use('/api/users', userRoutes)
  app.use('/api/orders', orderRoutes)
  app.use('/api/upload', uploadRoutes)
  app.use('/api/categories', categoryRoutes)
  app.use('/api/brands', brandRoutes)
  app.use('/api/cart', cartRoutes)
}

export default route
