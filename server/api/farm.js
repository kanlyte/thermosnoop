const router = require("express").Router();
const { Farm, User, Logs } = require("../models/models");
const jwt = require("jsonwebtoken");
const cryptoJs = require("crypto-js");
const axios = require("axios");
const { Op } = require("sequelize");
const { verifyToken, tokenRefresh } = require("../config/config");

//adding a farm
router.post("/farm", verifyToken, tokenRefresh, async (req, res) => {
  const { name, district, latitude, longtude, user_id } = req.body;
  try {
    const farm_name = await Farm.findOne({
      where: { name: name, user_id: user_id },
    });
    if (!farm_name) {
      const farm = await Farm.create({
        name,
        district,
        latitude,
        longtude,
        user_id,
      });

      res.status(200).json({
        status: true,
        data: "New farm added",
        farm: farm,
      });
    } else {
      res.status(409).json({
        status: false,
        data: "farm name already taken",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      data: "An error occurred while registering the user",
    });
  }
});
// getting all farms
router.get("/all/farms", verifyToken, async (req, res) => {
  try {
    const farms = await Farm.findAll();

    if (farms.length > 0) {
      res.status(200).json({
        status: true,
        data: "Available farms",
        result: farms,
      });
    } else {
      res.status(404).json({
        status: false,
        data: "No farms found",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      data: "An Error Occurred",
      result: error,
    });
  }
});

// getting a specific farm by id
router.get("/farm/:id", verifyToken, async (req, res) => {
  const farmId = req.params.id;

  try {
    const farm = await Farm.findByPk(farmId);

    if (farm) {
      res.status(200).json({
        status: true,
        data: "Farm found",
        result: farm,
      });
    } else {
      res.status(404).json({
        status: false,
        data: "Farm not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      data: "An Error Occurred",
      result: error,
    });
  }
});
// getting farms of one user using user id
router.get("/myfarms/:user_id", verifyToken, async (req, res) => {
  const userId = req.params.user_id;

  try {
    const farm = await Farm.findAll({
      where: {
        user_id: userId,
      },
    });
    if (farm) {
      res.status(200).json({
        status: true,
        data: "Farm found",
        result: farm,
      });
    } else {
      res.status(404).json({
        status: false,
        data: "Farm not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      data: "An Error Occurred",
      result: error,
    });
  }
});
// deleting a farm by id
router.delete("/delete/farm/:id", verifyToken, async (req, res) => {
  const farmId = req.params.id;

  try {
    const farm = await Farm.findByPk(farmId);

    if (!farm) {
      return res.status(404).json({
        status: false,
        data: "Farm not found",
      });
    }

    await farm.destroy();

    res.status(200).json({
      status: true,
      data: "Farm deleted successfully",
      result: farm,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      data: "An Error Occurred",
      result: error,
    });
  }
});

// Route to delete all weather logs
router.delete("/destroy/weather/logs", async (req, res) => {
  try {
    // Delete all entries in the logs table
    const deletedCount = await Logs.destroy({ where: {} });

    if (deletedCount === 0) {
      return res.status(404).json({
        status: false,
        message: "No logs found to delete.",
      });
    }

    res.status(200).json({
      status: true,
      message: "All weather logs deleted successfully.",
      deletedCount: deletedCount, // Include count of deleted logs
    });
  } catch (error) {
    console.error("Error deleting weather logs:", error.message);
    res.status(500).json({
      status: false,
      message: "An error occurred while deleting weather logs.",
      error: error.message,
    });
  }
});

// updating a farm by id
router.put("/update/farm/:id", verifyToken, tokenRefresh, async (req, res) => {
  const farmId = req.params.id;
  const { name, district, latitude, longitude, user_id } = req.body;

  try {
    const farm = await Farm.findByPk(farmId);

    if (!farm) {
      return res.status(404).json({
        status: true,
        data: "Farm not found",
      });
    }

    // Check if the new farm name is already taken by another farm
    const existingFarm = await Farm.findOne({
      where: { name: name },
    });

    if (existingFarm) {
      return res.status(409).json({
        status: false,
        data: "Farm name already taken",
      });
    }

    // Update farm details
    await farm.update({
      name,
      district,
      latitude,
      longitude,
      user_id,
    });

    res.status(200).json({
      status: true,
      data: "Farm updated successfully",
      result: farm,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      data: "An error occurred while updating the farm",
      result: error,
    });
  }
});

// Function to calculate discomfort level based on thermo stress value
function getDiscomfortLevel(thermoStress) {
  if (thermoStress >= 0 && thermoStress < 68) {
    return "No thermal Stress";
  } else if (thermoStress > 68 && thermoStress < 71) {
    return "Mild discomfort";
  } else if (thermoStress > 71 && thermoStress < 75) {
    return "Discomfort";
  } else if (thermoStress > 75 && thermoStress < 79) {
    return "Alert";
  } else if (thermoStress > 79 && thermoStress < 85) {
    return "Danger";
  } else if (thermoStress > 85 && thermoStress < 1000) {
    return "Emergency";
  } else {
    return "404 | try again";
  }
}
function getRecommendation(thermoStress) {
  if (thermoStress >= 0 && thermoStress < 68) {
    return "Maintain the thermal environment ";
  } else if (thermoStress > 68 && thermoStress < 72) {
    return "Restrict handling to no thermal stress     Avail shade free choice ";
  } else if (thermoStress >= 72 && thermoStress < 75) {
    return "Provide shade free choice.    Do not handle and or work animals ";
  } else if (thermoStress >= 75 && thermoStress < 79) {
    return "Implement cooling measures    Provide plenty of drinking water ";
  } else if (thermoStress >= 79 && thermoStress < 85) {
    return "Ensure plenty airflow (2.8 to 3.4 mph)";
  } else if (thermoStress >= 85 && thermoStress < 1000) {
    return "Withdraw feed and Keep light off in cattle houses";
  } else {
    return "Un usual experience";
  }
}
// Route to fetch weather data and store it in logs
router.post("/weather/check", async (req, res) => {
  try {
    const { lat, lon, farm_id } = req.body;

    if (!lat || !lon) {
      return res.status(400).json({
        status: false,
        data: "Latitude and Longitude are required.",
      });
    }

    const apiKey = "e0719f4bafafd7e13feb6d8de63910a1";
    const openWeatherMapEndpoint = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&lang=en&appid=${apiKey}`;

    const response = await axios.get(openWeatherMapEndpoint);

    const { current, hourly, daily } = response.data;

    // Extract current weather data
    const currentWeather = {
      temp: current.temp,
      pressure: current.pressure,
      humidity: current.humidity,
      clouds: current.clouds,
      description: current.weather[0].description,
    };

    // Next hour weather data
    const nextHour = hourly[1];
    const nextHourWeather = {
      temp: nextHour.temp,
      humidity: nextHour.humidity,
      pressure: nextHour.pressure,
      clouds: nextHour.clouds,
      description: nextHour.weather[0].description,
    };

    // Daily and weekly forecasts
    const dailyForecast = daily[0];
    const weeklyForecast = daily[6];

    // Thermo stress calculations
    const calculateThermoStress = (temp, humidity) =>
      1.8 * temp + 32 - (0.55 - 0.0055 * humidity) * (1.8 * temp - 26);

    const thermoStress = calculateThermoStress(
      currentWeather.temp,
      currentWeather.humidity
    );
    const discomfortLevel = getDiscomfortLevel(thermoStress);
    const recommendation = getRecommendation(thermoStress);

    const hrThermoStress = calculateThermoStress(
      nextHourWeather.temp,
      nextHourWeather.humidity
    );
    const hrDiscomfortLevel = getDiscomfortLevel(hrThermoStress);
    const hrRecommendation = getRecommendation(hrThermoStress);

    const dailyThermoStress = calculateThermoStress(
      dailyForecast.temp.day,
      dailyForecast.humidity
    );
    const dailyDiscomfortLevel = getDiscomfortLevel(dailyThermoStress);
    const dailyRecommendation = getRecommendation(dailyThermoStress);

    const weeklyThermoStress = calculateThermoStress(
      weeklyForecast.temp.day,
      weeklyForecast.humidity
    );
    const weeklyDiscomfortLevel = getDiscomfortLevel(weeklyThermoStress);
    const weeklyRecommendation = getRecommendation(weeklyThermoStress);

    // Store all data at once
    const logEntry = await Logs.create({
      farm_id,
      latitude: lat,
      longitude: lon,
      temp_value: currentWeather.temp,
      hum_value: currentWeather.humidity,
      pressure_value: currentWeather.pressure,
      clouds: currentWeather.clouds,
      wather_desc: currentWeather.description,
      hr_temp: nextHourWeather.temp,
      hr_hum: nextHourWeather.humidity,
      hr_pressure: nextHourWeather.pressure,
      hr_clouds: nextHourWeather.clouds,
      hr_desc: nextHourWeather.description,
      discomfortLevel,
      thermoStress,
      recommendation,
      hr_thermoStress: hrThermoStress,
      hr_discomfortLevel: hrDiscomfortLevel,
      hr_recommendation: hrRecommendation,
      daily_temp: dailyForecast.temp.day,
      daily_hum: dailyForecast.humidity,
      daily_thermoStress: dailyThermoStress,
      daily_discomfortLevel: dailyDiscomfortLevel,
      daily_recommandation: dailyRecommendation,
      weekly_temp: weeklyForecast.temp.day,
      weekly_hum: weeklyForecast.humidity,
      weekly_thermoStress: weeklyThermoStress,
      weekly_discomfortLevel: weeklyDiscomfortLevel,
      weekly_recommandation: weeklyRecommendation,
    });

    res.status(200).json({
      status: true,
      data: "Weather data retrieved and stored successfully",
      result: logEntry,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      data: "An error occurred while fetching and storing weather data",
      result: error.message,
    });
  }
});

//get weather logs given data from user instead
router.get("/weather/check/guest", async (req, res) => {
  try {
    const { temp, hum } = req.body;
    if (temp == null || hum == null) {
      return res.status(400).json({
        status: false,
        data: "please provide AT and RH.",
      });
    }

    //calculate current thermo
    const thermoStress =
      1.8 * temp + 32 - (0.55 - 0.0055 * hum) * (1.8 * temp - 26);

    // Calculate discomfort level based on current thermo stress
    const discomfortLevel = getDiscomfortLevel(thermoStress);
    const recommendation = getRecommendation(thermoStress);

    const forward_result = {
      thermostress_value: thermoStress,
      discomfort_level: discomfortLevel,
      recommendation: recommendation,
    };
    res.status(200).json({
      status: true,
      data: "current thermostress status",
      result: forward_result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: false,
      data: "An error occurred while fetching and storing weather data",
      result: error.message,
    });
  }
});

//get farm logs of a specific farm
router.get(
  "/farmlogs/:farm_id",
  //  verif yToken,
  async (req, res) => {
    const farmId = req.params.farm_id;

    try {
      const logs = await Logs.findAll({
        where: {
          farm_id: farmId,
        },
        limit: 20,
        order: [["id", "DESC"]],
      });

      if (logs) {
        res.status(200).json({
          status: true,
          data: "Your current logs are here",
          result: logs,
        });
      } else {
        res.status(404).json({
          status: false,
          data: "No logs found",
        });
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
      res.status(500).json({
        status: false,
        data: "An error occurred",
        error: error.message,
      });
    }
  }
);

// Route to get weather logs of a farm for the previous 7 days
router.post(
  "/farmlogs/last7days/:farm_id",
  // verifyToken,
  async (req, res) => {
    try {
      const farmId = req.params.farm_id;
      // Calculate the date 7 days ago
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const logs = await Logs.findAll({
        where: {
          farm_id: farmId,
          createdAt: {
            [Op.gte]: sevenDaysAgo,
          },
        },
        order: [["createdAt", "DESC"]],
      });

      if (logs && logs.length > 0) {
        res.status(200).json({
          status: true,
          data: "Logs from the past 7 days retrieved successfully.",
          result: logs,
        });
      } else {
        res.status(404).json({
          status: false,
          data: "No logs found for the specified farm in the past 7 days.",
        });
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
      res.status(500).json({
        status: false,
        data: "An error occurred while fetching logs.",
        error: error.message,
      });
    }
  }
);

module.exports = router;
