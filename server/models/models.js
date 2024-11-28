const { Sequelize, DataTypes, DATE, INTEGER, BIGINT } = require("sequelize");
const sequelize = new Sequelize({
  dialect: "mysql",
  dialectModule: require("mysql2"),
  host: process.env.HOST,
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
});

//user model
const User = sequelize.define(
  "fw_users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING,
    },
    last_name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    contact: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    district: {
      type: DataTypes.STRING,
    },
    refreshToken: {
      type: DataTypes.STRING,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "fw_users",
  }
);

//user preferences model
const UserPreference = sequelize.define(
  "fw_user_preferences",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    notification_freq: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "fw_user_preferences",
  }
);

//logs model
const Logs = sequelize.define(
  "fw_logs",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    farm_id: {
      type: DataTypes.INTEGER,
    },
    latitude: {
      type: DataTypes.DOUBLE,
    },
    longitude: {
      type: DataTypes.DOUBLE,
    },
    temp_value: {
      type: DataTypes.INTEGER,
    },
    hum_value: {
      type: DataTypes.INTEGER,
    },
    pressure_value: {
      type: DataTypes.INTEGER,
    },
    wather_desc: {
      type: DataTypes.STRING,
    },
    clouds: {
      type: DataTypes.STRING,
    },
    hr_temp: {
      type: DataTypes.INTEGER,
    },
    hr_hum: {
      type: DataTypes.INTEGER,
    },
    hr_pressure: {
      type: DataTypes.INTEGER,
    },
    hr_clouds: {
      type: DataTypes.STRING,
    },
    hr_desc: {
      type: DataTypes.STRING,
    },
    discomfortLevel: {
      type: DataTypes.STRING,
    },
    thermoStress: {
      type: DataTypes.STRING,
    },
    hr_thermoStress: {
      type: DataTypes.STRING,
    },
    hr_discomfortLevel: {
      type: DataTypes.STRING,
    },
    recommendation: {
      type: DataTypes.STRING,
    },
    hr_recommendation: {
      type: DataTypes.STRING,
    },
    daily_temp: {
      type: DataTypes.STRING,
    },
    daily_hum: {
      type: DataTypes.STRING,
    },
    weekly_temp: {
      type: DataTypes.STRING,
    },
    weekly_hum: {
      type: DataTypes.STRING,
    },
    daily_thermoStress: {
      type: DataTypes.STRING,
    },
    daily_discomfortLevel: {
      type: DataTypes.STRING,
    },
    daily_recommandation: {
      type: DataTypes.STRING,
    },
    weekly_thermoStress: {
      type: DataTypes.STRING,
    },
    weekly_discomfortLevel: {
      type: DataTypes.STRING,
    },
    weekly_recommandation: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "fw_logs",
    timestamps: true,
  }
);

//farm type model
const farmType = sequelize.define(
  "fw_farm_type",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "fw_farm_type",
  }
);

//farm farm type model
const farmFarmType = sequelize.define(
  "fw_farm_farm_type",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    farm_id: {
      type: DataTypes.INTEGER,
    },
    farm_type_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "fw_farm_farm_type",
  }
);
const Farm = sequelize.define(
  "fw_farm",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
    district: {
      type: DataTypes.STRING,
    },
    latitude: {
      type: DataTypes.STRING,
    },
    longtude: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "fw_farm",
  }
);

const Otp = sequelize.define(
  "otp",
  {
    otp_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    expiry: {
      type: DataTypes.BIGINT,
    },
    otp: {
      type: BIGINT,
    },
  },
  {
    tableName: "otp",
  }
);

module.exports = {
  sequelize,
  User,
  Farm,
  farmFarmType,
  farmType,
  Logs,
  UserPreference,
  Otp,
};
