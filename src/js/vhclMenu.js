import { getBghtUpgrs, getCurrentCity, checkLevel } from "./scr.js";
import { animateWindowClose, animateWindowOpen, showAlert } from "./utilities.js";
import { banana } from "./langs.js";
import { getCities } from "./data/cityData.js";
import { playRandomMouseClick } from "./sounds.js";

// yes this code is 100% chatgpt feel free to improve that if you know what you're doing
// it only took 2 prompts to get it to work somehow

// To add a new vehicle category:
//
// Add its configuration to the VEHICLE_CATEGORIES object
// Add corresponding HTML elements with the proper IDs
// The rest of the functionality will work automatically
//
// To add a new subcategory:
//
// Add it to the appropriate category's sections object in VEHICLE_CATEGORIES
// Add corresponding HTML elements
// The dropdown handling will work automatically

const VEHICLE_CATEGORIES = {
  buses: {
    id: "0",
    upgradeKey: "citybus",
    sections: {
      city: {
        id: "0",
        upgradeKey: "citybus",
        sectionId: "vhcl-menu-bus-sub-citybus-category",
        translationKey: "city-buses",
      },
      hydrogen: {
        id: "1",
        upgradeKey: "hydrogenbus",
        sectionId: "vhcl-menu-bus-sub-hydrogen-category",
        translationKey: "hydrogen-buses",
      },
      intercity: {
        id: "2",
        upgradeKey: "intercitybus",
        sectionId: "vhcl-menu-bus-sub-intercity-category",
        translationKey: "intercity-buses",
      },
    },
    mainSectionId: "vhcl-menu-bus-category",
    subDropdownId: "vhcl-menu-subcategory-dropdown-1",
  },
  trolleybuses: {
    id: "1",
    upgradeKey: "trolleybus",
    requiresCity: true,
    vehicleType: "trolleybuses",
    mainSectionId: "vhcl-menu-trolleybus-category",
    subDropdownId: "vhcl-menu-subcategory-dropdown-3",
    translationKey: "trolleybuses",
  },
  trams: {
    id: "2",
    upgradeKey: "tram",
    requiresCity: true,
    vehicleType: "trams",
    mainSectionId: "vhcl-menu-tram-category",
    subDropdownId: "vhcl-menu-subcategory-dropdown-4",
    translationKey: "trams",
    sections: {
      old: {
        id: "0",
        sectionId: "vhcl-menu-tram-category-main",
        translationKey: "old-trams",
        upgradeKey: "tram",
      },
      modern: {
        id: "1",
        sectionId: "vhcl-menu-tram-category-modern",
        requiresCity: true,
        vehicleType: "modern-trams",
        translationKey: "modern-trams",
        upgradeKey: "moderntram",
      },
    },
  },
};

const isGamePage = document.location.pathname.includes("game.html");

class VehicleMenuManager {
  constructor() {
    if (!isGamePage) return;
    this.cities = getCities();
    this.initializeElements();
    this.setupEventListeners();
  }

  initializeElements() {
    // Main dropdown and sections
    this.mainDropdown = document.querySelector("#vhcl-menu-category-dropdown");
    this.otherSections = document.querySelector("#vhcl-menu-other-categories");

    // Store sections and dropdowns in maps for easy access
    this.sections = new Map();
    this.subDropdowns = new Map();

    // Initialize sections and dropdowns from config
    Object.values(VEHICLE_CATEGORIES).forEach((category) => {
      this.sections.set(category.mainSectionId, document.querySelector(`#${category.mainSectionId}`));
      if (category.subDropdownId) {
        this.subDropdowns.set(category.subDropdownId, document.querySelector(`#${category.subDropdownId}`));
      }

      if (category.sections) {
        Object.values(category.sections).forEach((subcategory) => {
          if (subcategory.sectionId) {
            this.sections.set(subcategory.sectionId, document.querySelector(`#${subcategory.sectionId}`));
          }
        });
      }
    });
  }

  setupEventListeners() {
    // Main category dropdown
    this.mainDropdown.addEventListener("change", () => this.handleMainCategoryChange());

    // Bus subcategories dropdown
    const busSubDropdown = this.subDropdowns.get(VEHICLE_CATEGORIES.buses.subDropdownId);
    busSubDropdown?.addEventListener("change", () => this.handleBusSubcategoryChange());

    // Tram subcategories dropdown
    const tramSubDropdown = this.subDropdowns.get(VEHICLE_CATEGORIES.trams.subDropdownId);
    tramSubDropdown?.addEventListener("change", () => this.handleTramSubcategoryChange());
  }

  hideAllSections() {
    this.sections.forEach((section) => (section.style.display = "none"));
  }

  hideAllSubDropdowns() {
    this.subDropdowns.forEach((dropdown) => (dropdown.style.display = "none"));
  }

  resetDropdownValue(dropdownId, value = "0") {
    const id = dropdownId instanceof HTMLElement ? dropdownId.id : dropdownId;
    document.querySelector(`#${id}`).value = value;
  }

  checkCityRequirement(category) {
    if (!category.requiresCity) return true;

    const currentCity = getCurrentCity();
    const currentCityData = this.cities.find((city) => city.id === currentCity);
    return currentCityData?.vehicles.includes(category.vehicleType);
  }

  handleMainCategoryChange() {
    const category = Object.values(VEHICLE_CATEGORIES).find((cat) => cat.id === this.mainDropdown.value);

    if (!category) return;

    const bghtUpgrs = getBghtUpgrs();
    playRandomMouseClick();

    if (!bghtUpgrs.includes(category.upgradeKey)) {
      showAlert(banana.i18n("vhcl-category-locked", banana.i18n(category.translationKey)));
      this.resetDropdownValue(this.mainDropdown.id);
      return;
    }

    if (category.requiresCity && !this.checkCityRequirement(category)) {
      showAlert(banana.i18n("vhcl-category-locked-2"));
      this.resetDropdownValue(this.mainDropdown.id);
      return;
    }

    this.hideAllSections();
    this.hideAllSubDropdowns();

    const mainSection = this.sections.get(category.mainSectionId);
    if (mainSection) mainSection.style.display = "block";

    const subDropdown = this.subDropdowns.get(category.subDropdownId);
    if (subDropdown) {
      subDropdown.style.display = "block";

      // Show first subcategory content for different categories
      if (category.sections) {
        const firstSubcategory = Object.values(category.sections)[0];
        if (firstSubcategory) {
          this.resetDropdownValue(category.subDropdownId, firstSubcategory.id);
          const sectionEl = this.sections.get(firstSubcategory.sectionId);
          if (sectionEl) sectionEl.style.display = "block";
        }
      }
    }
  }

  handleBusSubcategoryChange() {
    const busConfig = VEHICLE_CATEGORIES.buses;
    const subcategory = Object.values(busConfig.sections).find(
      (sub) => sub.id === this.subDropdowns.get(busConfig.subDropdownId).value
    );

    if (!subcategory) return;

    const bghtUpgrs = getBghtUpgrs();
    playRandomMouseClick();

    if (!bghtUpgrs.includes(subcategory.upgradeKey)) {
      showAlert(banana.i18n("vhcl-category-locked", banana.i18n(subcategory.translationKey)));
      this.resetDropdownValue(busConfig.subDropdownId);
      return;
    }

    Object.values(busConfig.sections).forEach((section) => {
      const sectionEl = this.sections.get(section.sectionId);
      if (sectionEl) {
        sectionEl.style.display = section.id === subcategory.id ? "block" : "none";
      }
    });
  }

  handleTramSubcategoryChange() {
    const tramConfig = VEHICLE_CATEGORIES.trams;
    const subcategory = Object.values(tramConfig.sections).find(
      (sub) => sub.id === this.subDropdowns.get(tramConfig.subDropdownId).value
    );

    if (!subcategory) return;
    const bghtUpgrs = getBghtUpgrs();
    playRandomMouseClick();

    if (!bghtUpgrs.includes(subcategory.upgradeKey)) {
      showAlert(banana.i18n("vhcl-category-locked", banana.i18n(subcategory.translationKey)));
      this.resetDropdownValue(tramConfig.subDropdownId);
      return;
    }

    if (subcategory.requiresCity && !this.checkCityRequirement(subcategory)) {
      showAlert(banana.i18n("vhcl-category-locked-2"));
      this.resetDropdownValue(this.subDropdowns.get(tramConfig.subDropdownId));
      return;
    }

    Object.values(tramConfig.sections).forEach((section) => {
      const sectionEl = this.sections.get(section.sectionId);
      if (sectionEl) {
        sectionEl.style.display = section.id === subcategory.id ? "block" : "none";
      }
    });
  }
}

const vehicleMenu = new VehicleMenuManager();

if (isGamePage) {
  // open vehicle menu
  const navItemBuy = document.querySelector("#nav-item-buy");
  navItemBuy.addEventListener("click", async () => {
    const bghtUpgrs = getBghtUpgrs();
    const buygui = document.querySelector("#buy-vehicle");
    const tint = document.querySelector("#window-tint");
    if (bghtUpgrs.includes("citybus")) {
      checkLevel();
      const mainDropdown = document.querySelector("#vhcl-menu-category-dropdown");
      const selectedCategory = Object.values(VEHICLE_CATEGORIES).find((cat) => cat.id === mainDropdown.value);

      if (selectedCategory?.requiresCity) {
        const currentCity = getCurrentCity();
        const cities = getCities();
        const currentCityData = cities.find((city) => city.id === currentCity);

        if (!currentCityData?.vehicles.includes(selectedCategory.vehicleType)) {
          mainDropdown.value = "0";
          mainDropdown.dispatchEvent(new Event("change"));
        }
      }
      playRandomMouseClick();
      buygui.style.display = "flex";
      animateWindowOpen(buygui, true, tint);
    } else {
      playRandomMouseClick();
      buygui.style.display = "none";
      showAlert(banana.i18n("vhcl-category-unavailable-citybus"));
    }
  });

  // close vehicle menu
  const closeBusGuiBtn = document.querySelector("#close-bus-gui-btn");
  closeBusGuiBtn.addEventListener("click", () => {
    const buygui = document.querySelector("#buy-vehicle");
    const tint = document.querySelector("#window-tint");
    playRandomMouseClick();
    animateWindowClose(buygui, true, tint);
  });
}
