const SettingsGeneral = require("../../models/settings-general");
const systemConfig = require("../../config/system");


// [GET] /admin/settings/general
module.exports.general = async (req, res) => {
  const settingGeneral = await SettingsGeneral.findOne({});

  res.render("admin/pages/settings/general", {
    pageTitle: "Cài đặt chung",
    settingGeneral: settingGeneral
  });
};

// [PATCH] /admin/settings/general
module.exports.generalPatch = async (req, res) => {
  const settingGeneral = await SettingsGeneral.findOne({});

  if (settingGeneral) {
    await SettingsGeneral.updateOne({ _id: settingGeneral.id }, req.body);
  } else {
    const record = new SettingsGeneral(req.body);
    await record.save();
  }

  req.flash("success", "Cập nhật thành công!");
  res.redirect(req.get("Referer") || `${systemConfig.prefixAdmin}/`);
};
