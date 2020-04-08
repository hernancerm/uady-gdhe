class ServiceProvider {
  ReadGroups(callback) {
    $.ajax({
      type: "GET",
      url: "../src/services/READ_groups_GB_major.php",
    }).done(callback);
  }
}
