import { Op } from 'sequelize';
import { User, UserProfile, UserEmail } from '../src/users/user.model.js';
import { Role, UserRole } from '../src/auth/role.model.js';
import { hashPassword } from '../utils/password-utils.js';
import { SUPER_ADMIN_ROLE } from './role-constants.js';

/**
 * Asegura la existencia y credenciales del usuario base (Super Admin)
 */
export const seedAdminUser = async () => {
  try {
    // Se toma la contraseña del .env si existe, o se asigna el valor por defecto para desarrollo
    const defaultPassword = process.env.SUPER_ADMIN_SEED_PASSWORD || 'Admin123!';
    const hashedPassword = await hashPassword(defaultPassword);

    // 1. Asegurar SUPER ADMIN
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || 'lessencedefrance@gmail.com';
    let superAdminUser = await User.findOne({
      where: { [Op.or]: [{ Username: 'superadmin' }, { Email: superAdminEmail }] },
    });

    if (!superAdminUser) {
      const superAdminRole = await Role.findOne({ where: { Name: SUPER_ADMIN_ROLE } });

      if (!superAdminRole) {
        console.error('Error: El rol de SUPER_ADMIN no existe en la base de datos.');
        return;
      }

      superAdminUser = await User.create({
        Name: 'Super',
        Surname: 'Admin',
        Username: 'superadmin',
        Email: superAdminEmail,
        Password: hashedPassword,
        Status: true,
      });

      await UserProfile.create({ UserId: superAdminUser.Id, Phone: '47101927' });
      await UserEmail.create({ UserId: superAdminUser.Id, EmailVerified: true });
      await UserRole.create({ UserId: superAdminUser.Id, RoleId: superAdminRole.Id });

      console.log('SUPER ADMIN creado exitosamente.');
    } else {
      await superAdminUser.update({ Email: superAdminEmail, Password: hashedPassword });

      const existingEmailRow = await UserEmail.findOne({ where: { UserId: superAdminUser.Id } });
      if (existingEmailRow) {
        await existingEmailRow.update({ EmailVerified: true });
      } else {
        await UserEmail.create({ UserId: superAdminUser.Id, EmailVerified: true });
      }

      console.log('SUPER ADMIN sincronizado.');
    }

  } catch (error) {
    console.error('Error en el seeder de usuario Super Admin:', error.message);
  }
};