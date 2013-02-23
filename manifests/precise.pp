exec { "apt-update":
  command => "/usr/bin/apt-get update"
}

# Ensure apt-get update has been run before installing any packages
Exec["apt-update"] -> Package <| |>

package {
    "build-essential":
        ensure => installed,
        provider => apt;
    "python":
        ensure => installed,
        provider => apt;
    "python-dev":
        ensure => installed,
        provider => apt;
    "python-setuptools":
        ensure => installed,
        provider => apt;
    "python-software-properties":
        ensure => installed,
        provider => apt;
}

exec { "ppas":
  command => "/usr/bin/add-apt-repository ppa:ubuntugis && /usr/bin/add-apt-repository ppa:chris-lea/node.js && /usr/bin/apt-get update",
  require => Package['python-software-properties'],
}

package { "gdal-bin":
  ensure => latest,
  require => Exec['ppas'],
}

package { "nodejs": 
  ensure => latest,
  require => Exec['ppas']
}

package { "npm": 
  ensure => latest,
  require => Exec['ppas']
}


