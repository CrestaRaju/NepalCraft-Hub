module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    role: {
      type: Sequelize.ENUM('buyer', 'seller', 'admin'),
      defaultValue: 'buyer'
    },
    phoneNumber: {
      type: Sequelize.STRING
    },
    address: {
      type: Sequelize.TEXT
    },
    isVerified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    // Artisan provenance story (for sellers)
    provenanceStory: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    // Profile photo URL
    profilePhoto: {
      type: Sequelize.STRING,
      allowNull: true
    },
    // For admin dashboard - account active/blocked
    isActive: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    }
  }, {
    timestamps: true
  });

  return User;
};
