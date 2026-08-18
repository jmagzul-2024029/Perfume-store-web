import { User, UserProfile, UserEmail } from '../src/users/user.model.js';
import { Role, UserRole } from '../src/auth/role.model.js';
import { hashPassword } from '../utils/password-utils.js';
import { SUPER_ADMIN_ROLE, ADMIN_ROLE } from './role-constants.js';

/**
 * Asegura la existencia y contraseñas de los usuarios base (Super Admin y Admin)
 */
export const seedAdminUser = async () => {
  try {
    const defaultPassword = 'Admin123!';
    const hashedPassword = await hashPassword(defaultPassword);

    // 1. Asegurar SUPER ADMIN
    const superAdminEmail = 'superadmin@perfumeria.com';
    let superAdminUser = await User.findOne({ where: { Email: superAdminEmail } });
    if (!superAdminUser) {
      const superAdminRole = await Role.findOne({ where: { Name: SUPER_ADMIN_ROLE } });
      superAdminUser = await User.create({
        Name: 'Super', Surname: 'Admin', Username: 'superadmin', Email: superAdminEmail, Password: hashedPassword, Status: true,
      });
      await UserProfile.create({ UserId: superAdminUser.Id, Phone: '00000000' });
      await UserEmail.create({ UserId: superAdminUser.Id, EmailVerified: true });
      await UserRole.create({ UserId: superAdminUser.Id, RoleId: superAdminRole.Id });
      console.log('🎉 SUPER ADMIN creado.');
    } else {
      await superAdminUser.update({ Password: hashedPassword });
      console.log('✅ SUPER ADMIN sincronizado.');
    }

    // 2. Asegurar ADMIN
    const adminEmail = 'admin@perfumeria.com';
    let adminUser = await User.findOne({ where: { Email: adminEmail } });
    if (!adminUser) {
      const adminRole = await Role.findOne({ where: { Name: ADMIN_ROLE } });
      adminUser = await User.create({
        Name: 'Administrador', Surname: 'Kinal', Username: 'admin', Email: adminEmail, Password: hashedPassword, Status: true,
      });
      await UserProfile.create({ UserId: adminUser.Id, Phone: '88888888' });
      await UserEmail.create({ UserId: adminUser.Id, EmailVerified: true });
      await UserRole.create({ UserId: adminUser.Id, RoleId: adminRole.Id });
      console.log('👤 Admin creado.');
    } else {
      await adminUser.update({ Password: hashedPassword });
      console.log('✅ Admin sincronizado.');
    }

  } catch (error) {
    console.error('❌ Error en el seeder de usuarios:', error.message);
  }
};
