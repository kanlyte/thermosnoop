const router = require("express").Router();
const { Farm, IotLog, IotCommand } = require("../models/models");
const { verifyToken } = require("../config/config");

// device posts a telemetry reading
router.post("/iot/logs", async (req, res) => {
  try {
    const { id: device_id, rea, out, con, sen, wifi, upt, frh } = req.body;

    if (!device_id) {
      return res.status(400).json({
        status: false,
        data: "device id is required",
      });
    }

    const farm = await Farm.findOne({ where: { device_id } });

    const log = await IotLog.create({
      device_id,
      farm_id: farm ? farm.id : null,
      temp: rea?.t,
      humidity: rea?.h,
      thi: rea?.thi,
      thi_status: rea?.thiStr,
      out_cooler: out?.c,
      out_fan_speed: out?.fs,
      out_humidifier: out?.hu,
      out_heater: out?.he,
      out_sprinkler: out?.s,
      con_mode: con?.m,
      sen_dht1: sen?.dht1,
      sen_dht2: sen?.dht2,
      wifi_on: wifi?.on,
      wifi_ssid: wifi?.ssid,
      wifi_ip: wifi?.ip,
      wifi_signal: wifi?.sig,
      uptime: upt,
      free_heap: frh,
    });

    res.status(201).json({
      status: true,
      data: "Log stored successfully",
      result: log,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      data: "An error occurred while storing the device log",
    });
  }
});

// app queues a command for a device
router.post("/iot/command", verifyToken, async (req, res) => {
  try {
    const { device_id, command, payload } = req.body;

    if (!device_id || !command) {
      return res.status(400).json({
        status: false,
        data: "device_id and command are required",
      });
    }

    const farm = await Farm.findOne({ where: { device_id } });

    const newCommand = await IotCommand.create({
      device_id,
      farm_id: farm ? farm.id : null,
      command,
      payload,
      status: "pending",
    });

    res.status(201).json({
      status: true,
      data: "Command queued for device",
      result: newCommand,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      data: "An error occurred while queuing the command",
    });
  }
});

// device polls for its next pending command
router.get("/iot/command/:device_id", async (req, res) => {
  try {
    const { device_id } = req.params;

    const command = await IotCommand.findOne({
      where: { device_id, status: "pending" },
      order: [["id", "ASC"]],
    });

    if (!command) {
      return res.status(200).json({
        status: true,
        command: null,
      });
    }

    command.status = "delivered";
    command.delivered_at = new Date();
    await command.save();

    res.status(200).json({
      status: true,
      command: {
        id: command.id,
        command: command.command,
        payload: command.payload,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      data: "An error occurred while fetching the command",
    });
  }
});

// app reads recent telemetry for a device (newest first)
router.get("/iot/logs/:device_id", verifyToken, async (req, res) => {
  try {
    const { device_id } = req.params;
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);

    const logs = await IotLog.findAll({
      where: { device_id },
      order: [["id", "DESC"]],
      limit,
    });

    res.status(200).json({
      status: true,
      result: logs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      data: "An error occurred while fetching the device logs",
    });
  }
});

module.exports = router;
