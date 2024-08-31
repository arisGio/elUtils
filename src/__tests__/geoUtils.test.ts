import administrativeRegionsEl from "../../data/administrative-regions-el.json";
import administrativeRegionsEn from "../../data/administrative-regions-en.json";
import citiesEl from "../../data/cities-el.json";
import citiesEn from "../../data/cities-en.json";
import geographicRegionsEl from "../../data/geographic-regions-el.json";
import geographicRegionsEn from "../../data/geographic-regions-en.json";
import postalCodes from "../../data/postal-codes.json";
import prefecturesEl from "../../data/prefectures-el.json";
import prefecturesEn from "../../data/prefectures-en.json";
import taxOfficesEl from "../../data/taxOffices-el.json";
import taxOfficesEn from "../../data/taxOffices-en.json";
import {
  MOUNT_ATHOS_PREFECTURE_ID,
  MOUNT_ATHOS_REGION_ID,
  findByPostalCode,
  getAdministrativeRegionById,
  getAdministrativeRegionByIsoCode,
  getAdministrativeRegions,
  getAdministrativeUnitById,
  getAdministrativeUnits,
  getAllPostalCodes,
  getAllTaxOffices,
  getCities,
  getGeographicRegionById,
  getGeographicRegions,
  getMunicipalities,
  getPrefectureById,
  getPrefectures,
  getTaxOfficeById,
  getTaxOfficesByMunicipalityId,
  getTaxOfficesByPostalCode,
  getTaxOfficesByRegionId,
  getTaxOfficesByUnitId,
  searchTaxOffice,
} from "../geoUtils";

const administrativeRegions = { el: administrativeRegionsEl, en: administrativeRegionsEn };
const administrativeRegionsWithoutMountAthos = {
  el: administrativeRegions.el.filter(({ id }) => id !== MOUNT_ATHOS_REGION_ID),
  en: administrativeRegions.en.filter(({ id }) => id !== MOUNT_ATHOS_REGION_ID),
};
const cities = { el: citiesEl, en: citiesEn };
const geographicRegions = { el: geographicRegionsEl, en: geographicRegionsEn };
const prefectures = { el: prefecturesEl, en: prefecturesEn };
export const prefecturesWithoutMountAthos = {
  el: prefectures.el.filter(({ id }) => id !== MOUNT_ATHOS_PREFECTURE_ID),
  en: prefectures.en.filter(({ id }) => id !== MOUNT_ATHOS_PREFECTURE_ID),
};

describe("getAdministrativeRegions", () => {
  it("correctly returns data with default values (in greek language)", () => {
    const expectedData = administrativeRegionsWithoutMountAthos.el;

    expect(getAdministrativeRegions()).toEqual(expectedData);
    expect(getAdministrativeRegions({ locale: "el" })).toEqual(expectedData);
    expect(getAdministrativeRegions({ includeMountAthos: false })).toEqual(expectedData);
    expect(getAdministrativeRegions({ level: "municipality" })).toEqual(expectedData);
    // all default options
    expect(getAdministrativeRegions({ locale: "el", includeMountAthos: false, level: "municipality" })).toEqual(
      expectedData,
    );
    expect(getAdministrativeRegions().length).toEqual(13);
  });

  it("correctly returns data including Mount Athos (in greek language)", () => {
    const expectedData = administrativeRegions.el;

    expect(getAdministrativeRegions({ includeMountAthos: true })).toEqual(expectedData);
    expect(getAdministrativeRegions({ locale: "el", includeMountAthos: true })).toEqual(expectedData);
    expect(getAdministrativeRegions({ locale: "el", includeMountAthos: true, level: "municipality" })).toEqual(
      expectedData,
    );
    expect(getAdministrativeRegions({ includeMountAthos: true }).length).toEqual(14);
  });

  it("correctly returns data depending the level (in greek language)", () => {
    const expectedRegionLevelData = administrativeRegionsWithoutMountAthos.el.map(
      ({ units: _units, ...region }) => region,
    );
    const expectedUnitLevelData = administrativeRegionsWithoutMountAthos.el.map((region) => ({
      ...region,
      units: region.units.map(({ municipalities: _municipalities, ...unit }) => unit),
    }));
    const expectedMunicipalityLevelData = administrativeRegionsWithoutMountAthos.el;

    expect(getAdministrativeRegions({ level: "region" })).toEqual(expectedRegionLevelData);
    expect(getAdministrativeRegions({ level: "unit" })).toEqual(expectedUnitLevelData);
    expect(getAdministrativeRegions({ level: "municipality" })).toEqual(expectedMunicipalityLevelData);
  });

  it("correctly returns data (in english language)", () => {
    const expectedData = administrativeRegionsWithoutMountAthos.en;

    expect(getAdministrativeRegions({ locale: "en" })).toEqual(expectedData);
    expect(getAdministrativeRegions({ locale: "en", includeMountAthos: false })).toEqual(expectedData);
    expect(getAdministrativeRegions({ locale: "en", level: "municipality" })).toEqual(expectedData);
    expect(getAdministrativeRegions().length).toEqual(13);
  });

  it("correctly returns data including Mount Athos (in english language)", () => {
    const expectedData = administrativeRegions.en;

    expect(getAdministrativeRegions({ locale: "en", includeMountAthos: true })).toEqual(expectedData);
    expect(getAdministrativeRegions({ locale: "en", includeMountAthos: true, level: "municipality" })).toEqual(
      expectedData,
    );
    expect(getAdministrativeRegions({ locale: "en", includeMountAthos: true }).length).toEqual(14);
  });

  it("correctly returns data depending the level (in english language)", () => {
    const expectedRegionLevelData = administrativeRegionsWithoutMountAthos.en.map(
      ({ units: _units, ...region }) => region,
    );
    const expectedUnitLevelData = administrativeRegionsWithoutMountAthos.en.map((region) => ({
      ...region,
      units: region.units.map(({ municipalities: _municipalities, ...unit }) => unit),
    }));

    expect(getAdministrativeRegions({ locale: "en", level: "region" })).toEqual(expectedRegionLevelData);
    expect(getAdministrativeRegions({ locale: "en", level: "unit" })).toEqual(expectedUnitLevelData);
    expect(getAdministrativeRegions({ locale: "en", level: "municipality" })).toEqual(
      administrativeRegionsWithoutMountAthos.en,
    );
  });
});

describe("getAdministrativeRegionById", () => {
  it("correctly returns region with default values (in greek language)", () => {
    const expectedData = administrativeRegionsWithoutMountAthos.el[0];

    expect(getAdministrativeRegionById({ id: 1 })).toEqual(expectedData);
    expect(getAdministrativeRegionById({ id: 1, locale: "el" })).toEqual(expectedData);
    expect(getAdministrativeRegionById({ id: 1, includeMountAthos: false })).toEqual(expectedData);
    expect(getAdministrativeRegionById({ id: 1, level: "municipality" })).toEqual(expectedData);
    // all default options
    expect(
      getAdministrativeRegionById({ id: 1, locale: "el", includeMountAthos: false, level: "municipality" }),
    ).toEqual(expectedData);
  });

  it("correctly returns Mount Athos region (in greek language)", () => {
    const expectedData = administrativeRegions.el[13];

    expect(getAdministrativeRegionById({ id: 14, includeMountAthos: true })).toEqual(expectedData);
    expect(getAdministrativeRegionById({ id: 14, locale: "el", includeMountAthos: true })).toEqual(expectedData);
    expect(
      getAdministrativeRegionById({ id: 14, locale: "el", includeMountAthos: true, level: "municipality" }),
    ).toEqual(expectedData);
  });

  it("correctly returns region data with correct level (in greek language)", () => {
    const expectedRegionLevelData = administrativeRegionsWithoutMountAthos.el.map(
      ({ units: _units, ...region }) => region,
    )[7];
    const expectedUnitLevelData = administrativeRegionsWithoutMountAthos.el.map((region) => ({
      ...region,
      units: region.units.map(({ municipalities: _municipalities, ...unit }) => unit),
    }))[7];
    const expectedMunicipalityLevelData = administrativeRegionsWithoutMountAthos.el[7];

    expect(getAdministrativeRegionById({ id: 8, level: "region" })).toStrictEqual(expectedRegionLevelData);
    expect(getAdministrativeRegionById({ id: 8, level: "unit" })).toStrictEqual(expectedUnitLevelData);
    expect(getAdministrativeRegionById({ id: 8, level: "municipality" })).toStrictEqual(expectedMunicipalityLevelData);
  });

  it("correctly returns region (in english language)", () => {
    const expectedData = administrativeRegionsWithoutMountAthos.en[3];

    expect(getAdministrativeRegionById({ id: 4, locale: "en" })).toEqual(expectedData);
    expect(getAdministrativeRegionById({ id: 4, locale: "en", includeMountAthos: false })).toEqual(expectedData);
    expect(getAdministrativeRegionById({ id: 4, locale: "en", level: "municipality" })).toEqual(expectedData);
    // all default options
    expect(
      getAdministrativeRegionById({ id: 4, locale: "en", includeMountAthos: false, level: "municipality" }),
    ).toEqual(expectedData);
  });

  it("correctly returns Mount Athos region (in english language)", () => {
    const expectedData = administrativeRegions.en[13];

    expect(getAdministrativeRegionById({ id: 14, locale: "en", includeMountAthos: true })).toEqual(expectedData);
    expect(
      getAdministrativeRegionById({ id: 14, locale: "en", includeMountAthos: true, level: "municipality" }),
    ).toEqual(expectedData);
  });

  it("correctly returns region data with correct level (in english language)", () => {
    const expectedRegionLevelData = administrativeRegionsWithoutMountAthos.en.map(
      ({ units: _units, ...region }) => region,
    )[5];
    const expectedUnitLevelData = administrativeRegionsWithoutMountAthos.en.map((region) => ({
      ...region,
      units: region.units.map(({ municipalities: _municipalities, ...unit }) => unit),
    }))[5];
    const expectedMunicipalityLevelData = administrativeRegionsWithoutMountAthos.en[5];

    expect(getAdministrativeRegionById({ id: 6, locale: "en", level: "region" })).toStrictEqual(
      expectedRegionLevelData,
    );
    expect(getAdministrativeRegionById({ id: 6, locale: "en", level: "unit" })).toStrictEqual(expectedUnitLevelData);
    expect(getAdministrativeRegionById({ id: 6, locale: "en", level: "municipality" })).toStrictEqual(
      expectedMunicipalityLevelData,
    );
  });
});

describe("getAdministrativeRegionByIsoCode", () => {
  it("correctly returns region with default values (in greek language)", () => {
    const expectedData = administrativeRegionsWithoutMountAthos.el[0];

    expect(getAdministrativeRegionByIsoCode({ isocode: "GR-A" })).toEqual(expectedData);
    expect(getAdministrativeRegionByIsoCode({ isocode: "GR-A", locale: "el" })).toEqual(expectedData);
    expect(getAdministrativeRegionByIsoCode({ isocode: "GR-A", includeMountAthos: false })).toEqual(expectedData);
    expect(getAdministrativeRegionByIsoCode({ isocode: "GR-A", level: "municipality" })).toEqual(expectedData);
    // all default options
    expect(
      getAdministrativeRegionByIsoCode({
        isocode: "GR-A",
        locale: "el",
        includeMountAthos: false,
        level: "municipality",
      }),
    ).toEqual(expectedData);
  });

  it("correctly returns Mount Athos region (in greek language)", () => {
    const expectedData = administrativeRegions.el[13];

    expect(getAdministrativeRegionByIsoCode({ isocode: "GR-69", includeMountAthos: true })).toEqual(expectedData);
    expect(getAdministrativeRegionByIsoCode({ isocode: "GR-69", locale: "el", includeMountAthos: true })).toEqual(
      expectedData,
    );
    expect(
      getAdministrativeRegionByIsoCode({
        isocode: "GR-69",
        locale: "el",
        includeMountAthos: true,
        level: "municipality",
      }),
    ).toEqual(expectedData);
  });

  it("correctly returns region data with correct level (in greek language)", () => {
    const expectedRegionLevelData = administrativeRegionsWithoutMountAthos.el.map(
      ({ units: _units, ...region }) => region,
    )[7];
    const expectedUnitLevelData = administrativeRegionsWithoutMountAthos.el.map((region) => ({
      ...region,
      units: region.units.map(({ municipalities: _municipalities, ...unit }) => unit),
    }))[7];
    const expectedMunicipalityLevelData = administrativeRegionsWithoutMountAthos.el[7];

    expect(getAdministrativeRegionByIsoCode({ isocode: "GR-H", level: "region" })).toStrictEqual(
      expectedRegionLevelData,
    );
    expect(getAdministrativeRegionByIsoCode({ isocode: "GR-H", level: "unit" })).toStrictEqual(expectedUnitLevelData);
    expect(getAdministrativeRegionByIsoCode({ isocode: "GR-H", level: "municipality" })).toStrictEqual(
      expectedMunicipalityLevelData,
    );
  });

  it("correctly returns region (in english language)", () => {
    const expectedData = administrativeRegionsWithoutMountAthos.en[3];

    expect(getAdministrativeRegionByIsoCode({ isocode: "GR-D", locale: "en" })).toEqual(expectedData);
    expect(getAdministrativeRegionByIsoCode({ isocode: "GR-D", locale: "en", includeMountAthos: false })).toEqual(
      expectedData,
    );
    expect(getAdministrativeRegionByIsoCode({ isocode: "GR-D", locale: "en", level: "municipality" })).toEqual(
      expectedData,
    );
    // all default options
    expect(
      getAdministrativeRegionByIsoCode({
        isocode: "GR-D",
        locale: "en",
        includeMountAthos: false,
        level: "municipality",
      }),
    ).toEqual(expectedData);
  });

  it("correctly returns Mount Athos region (in english language)", () => {
    const expectedData = administrativeRegions.en[13];

    expect(getAdministrativeRegionByIsoCode({ isocode: "GR-69", locale: "en", includeMountAthos: true })).toEqual(
      expectedData,
    );
    expect(
      getAdministrativeRegionByIsoCode({
        isocode: "GR-69",
        locale: "en",
        includeMountAthos: true,
        level: "municipality",
      }),
    ).toEqual(expectedData);
  });

  it("correctly returns region data with correct level (in english language)", () => {
    const expectedRegionLevelData = administrativeRegionsWithoutMountAthos.en.map(
      ({ units: _units, ...region }) => region,
    )[5];
    const expectedUnitLevelData = administrativeRegionsWithoutMountAthos.en.map((region) => ({
      ...region,
      units: region.units.map(({ municipalities: _municipalities, ...unit }) => unit),
    }))[5];
    const expectedMunicipalityLevelData = administrativeRegionsWithoutMountAthos.en[5];

    expect(getAdministrativeRegionByIsoCode({ isocode: "GR-F", locale: "en", level: "region" })).toStrictEqual(
      expectedRegionLevelData,
    );
    expect(getAdministrativeRegionByIsoCode({ isocode: "GR-F", locale: "en", level: "unit" })).toStrictEqual(
      expectedUnitLevelData,
    );
    expect(getAdministrativeRegionByIsoCode({ isocode: "GR-F", locale: "en", level: "municipality" })).toStrictEqual(
      expectedMunicipalityLevelData,
    );
  });
});

describe("getAdministrativeUnits", () => {
  it("correctly returns data with default values (in greek language)", () => {
    const expectedData = administrativeRegionsWithoutMountAthos.el.flatMap(({ units }) => [...units]);

    expect(getAdministrativeUnits()).toStrictEqual(expectedData);
    expect(getAdministrativeUnits({ locale: "el" })).toStrictEqual(expectedData);
    expect(getAdministrativeUnits({ includeMountAthos: false })).toStrictEqual(expectedData);
    expect(getAdministrativeUnits({ level: "municipality" })).toStrictEqual(expectedData);
    // all default options
    expect(getAdministrativeUnits({ locale: "el", includeMountAthos: false, level: "municipality" })).toStrictEqual(
      expectedData,
    );

    expect(getAdministrativeUnits().length).toBe(74);
  });

  it("correctly returns data including Mount Athos (in greek language)", () => {
    const expectedData = administrativeRegions.el.flatMap(({ units }) => [...units]);

    expect(getAdministrativeUnits({ includeMountAthos: true })).toStrictEqual(expectedData);
    expect(getAdministrativeUnits({ locale: "el", includeMountAthos: true })).toStrictEqual(expectedData);
    expect(getAdministrativeUnits({ locale: "el", includeMountAthos: true, level: "municipality" })).toStrictEqual(
      expectedData,
    );

    expect(getAdministrativeUnits({ includeMountAthos: true }).length).toBe(75);
  });

  it("correctly returns data depending the level (in greek language)", () => {
    const expectedUnitLevelData = administrativeRegionsWithoutMountAthos.el
      .flatMap(({ units }) => [...units])
      .map(({ municipalities: _municipalities, ...unit }) => unit);
    const expectedMunicipalityLevelData = administrativeRegionsWithoutMountAthos.el.flatMap(({ units }) => [...units]);

    expect(getAdministrativeUnits({ level: "unit" })).toStrictEqual(expectedUnitLevelData);
    expect(getAdministrativeUnits({ level: "municipality" })).toStrictEqual(expectedMunicipalityLevelData);
  });

  it("correctly returns data (in english language)", () => {
    const expectedData = administrativeRegionsWithoutMountAthos.en.flatMap(({ units }) => [...units]);

    expect(getAdministrativeUnits({ locale: "en" })).toStrictEqual(expectedData);
    expect(getAdministrativeUnits({ locale: "en", includeMountAthos: false })).toStrictEqual(expectedData);
    expect(getAdministrativeUnits({ locale: "en", level: "municipality" })).toStrictEqual(expectedData);

    expect(getAdministrativeUnits().length).toBe(74);
  });

  it("correctly returns data including Mount Athos (in english language)", () => {
    const expectedData = administrativeRegions.en.flatMap(({ units }) => [...units]);

    expect(getAdministrativeUnits({ locale: "en", includeMountAthos: true })).toStrictEqual(expectedData);
    expect(getAdministrativeUnits({ locale: "en", includeMountAthos: true, level: "municipality" })).toStrictEqual(
      expectedData,
    );

    expect(getAdministrativeUnits({ locale: "en", includeMountAthos: true }).length).toBe(75);
  });

  it("correctly returns data depending the level (in english language)", () => {
    const expectedUnitLevelData = administrativeRegionsWithoutMountAthos.en
      .flatMap(({ units }) => [...units])
      .map(({ municipalities: _municipalities, ...unit }) => unit);
    const expectedMunicipalityLevelData = administrativeRegionsWithoutMountAthos.en.flatMap(({ units }) => [...units]);

    expect(getAdministrativeUnits({ locale: "en", level: "unit" })).toStrictEqual(expectedUnitLevelData);
    expect(getAdministrativeUnits({ locale: "en", level: "municipality" })).toStrictEqual(
      expectedMunicipalityLevelData,
    );
  });
});

describe("getAdministrativeUnitById", () => {
  it("correctly returns region with default values (in greek language)", () => {
    const expectedData = administrativeRegionsWithoutMountAthos.el.flatMap(({ units }) => [...units])[0];

    expect(getAdministrativeUnitById({ id: 1 })).toEqual(expectedData);
    expect(getAdministrativeUnitById({ id: 1, locale: "el" })).toEqual(expectedData);
    expect(getAdministrativeUnitById({ id: 1, includeMountAthos: false })).toEqual(expectedData);
    expect(getAdministrativeUnitById({ id: 1, level: "municipality" })).toEqual(expectedData);
    // all default options
    expect(getAdministrativeUnitById({ id: 1, locale: "el", includeMountAthos: false, level: "municipality" })).toEqual(
      expectedData,
    );
  });

  it("correctly returns Mount Athos region (in greek language)", () => {
    const expectedData = administrativeRegions.el.flatMap(({ units }) => [...units])[74];

    expect(getAdministrativeUnitById({ id: 75, includeMountAthos: true })).toEqual(expectedData);
    expect(getAdministrativeUnitById({ id: 75, locale: "el", includeMountAthos: true })).toEqual(expectedData);
    expect(getAdministrativeUnitById({ id: 75, locale: "el", includeMountAthos: true, level: "municipality" })).toEqual(
      expectedData,
    );
  });

  it("correctly returns region data with correct level (in greek language)", () => {
    const expectedUnitLevelData = administrativeRegionsWithoutMountAthos.el
      .flatMap(({ units }) => [...units])
      .map(({ municipalities: _municipalities, ...unit }) => unit)[15];
    const expectedMunicipalityLevelData = administrativeRegionsWithoutMountAthos.el.flatMap(({ units }) => [
      ...units,
    ])[15];

    expect(getAdministrativeUnitById({ id: 16, level: "unit" })).toEqual(expectedUnitLevelData);
    expect(getAdministrativeUnitById({ id: 16, level: "municipality" })).toEqual(expectedMunicipalityLevelData);
  });

  it("correctly returns region (in english language)", () => {
    const expectedData = administrativeRegionsWithoutMountAthos.en.flatMap(({ units }) => [...units])[3];

    expect(getAdministrativeUnitById({ id: 4, locale: "en" })).toEqual(expectedData);
    expect(getAdministrativeUnitById({ id: 4, locale: "en", includeMountAthos: false })).toEqual(expectedData);
    expect(getAdministrativeUnitById({ id: 4, locale: "en", level: "municipality" })).toEqual(expectedData);
    // all default options
    expect(getAdministrativeUnitById({ id: 4, locale: "en", includeMountAthos: false, level: "municipality" })).toEqual(
      expectedData,
    );
  });

  it("correctly returns Mount Athos region (in english language)", () => {
    const expectedData = administrativeRegions.en.flatMap(({ units }) => [...units])[74];

    expect(getAdministrativeUnitById({ id: 75, locale: "en", includeMountAthos: true })).toEqual(expectedData);
    expect(getAdministrativeUnitById({ id: 75, locale: "en", includeMountAthos: true, level: "municipality" })).toEqual(
      expectedData,
    );
  });

  it("correctly returns region data with correct level (in english language)", () => {
    const expectedUnitLevelData = administrativeRegionsWithoutMountAthos.en
      .flatMap(({ units }) => [...units])
      .map(({ municipalities: _municipalities, ...unit }) => unit)[25];
    const expectedMunicipalityLevelData = administrativeRegionsWithoutMountAthos.en.flatMap(({ units }) => [
      ...units,
    ])[25];

    expect(getAdministrativeUnitById({ id: 26, locale: "en", level: "unit" })).toStrictEqual(expectedUnitLevelData);
    expect(getAdministrativeUnitById({ id: 26, locale: "en", level: "municipality" })).toStrictEqual(
      expectedMunicipalityLevelData,
    );
  });
});

describe("getMunicipalities", () => {
  it("correctly returns data with default values (in greek language)", () => {
    const expectedData = administrativeRegionsWithoutMountAthos.el
      .flatMap(({ units }) => [...units])
      .flatMap(({ municipalities }) => [...municipalities]);

    expect(getMunicipalities()).toStrictEqual(expectedData);
    // all default options
    expect(getMunicipalities({ locale: "el" })).toStrictEqual(expectedData);
    expect(getMunicipalities().length).toBe(332);
  });

  it("correctly returns data (in english language)", () => {
    const expectedData = administrativeRegionsWithoutMountAthos.en
      .flatMap(({ units }) => [...units])
      .flatMap(({ municipalities }) => [...municipalities]);

    expect(getMunicipalities({ locale: "en" })).toStrictEqual(expectedData);
    expect(getMunicipalities({ locale: "en" }).length).toBe(332);
  });
});

describe("getCities", () => {
  it("correctly returns data with default values (in greek language)", () => {
    const expectedData = cities.el;
    expect(getCities()).toStrictEqual(expectedData);
    // all default options
    expect(getCities({ locale: "el" })).toStrictEqual(expectedData);
    expect(getCities().length).toBe(51);
  });

  it("correctly returns data (in english language)", () => {
    const expectedData = cities.en;
    expect(getCities({ locale: "en" })).toStrictEqual(expectedData);
    expect(getCities({ locale: "en" }).length).toBe(51);
  });
});

describe("getGeographicRegions:", () => {
  it("correctly returns all geographic regions in greek language", () => {
    const expectedData = geographicRegions.el;

    expect(getGeographicRegions()).toEqual(expectedData);
    expect(getGeographicRegions({ locale: "el" })).toEqual(expectedData);
    expect(getGeographicRegions().length).toEqual(9);
  });

  it("correctly returns all geographic regions in english language", () => {
    const expectedData = geographicRegions.en;

    expect(getGeographicRegions({ locale: "en" })).toEqual(expectedData);
    expect(getGeographicRegions().length).toEqual(9);
  });
});

describe("getGeographicRegionById:", () => {
  it("correctly returns geographic region by id (in greek language)", () => {
    const expectedData = geographicRegions.el[4];

    expect(getGeographicRegionById({ id: 5 })).toEqual(expectedData);
    expect(getGeographicRegionById({ id: 5, locale: "el" })).toEqual(expectedData);
  });

  it("correctly returns geographic region by id (in english language)", () => {
    const expectedData = geographicRegions.en[4];

    expect(getGeographicRegionById({ id: 5, locale: "en" })).toEqual(expectedData);
  });
});

describe("getPrefectures", () => {
  it("correctly returns data with default values (in greek language)", () => {
    const expectedData = prefecturesWithoutMountAthos.el;

    expect(getPrefectures()).toEqual(expectedData);
    expect(getPrefectures({ locale: "el" })).toEqual(expectedData);
    expect(getPrefectures({ includeMountAthos: false })).toEqual(expectedData);
    expect(getPrefectures({ locale: "el", includeMountAthos: false })).toEqual(expectedData);
    expect(getPrefectures().length).toBe(54);
  });

  it("correctly returns data including Mount Athos (in greek language)", () => {
    const expectedData = prefectures.el;

    expect(getPrefectures({ includeMountAthos: true })).toEqual(expectedData);
    expect(getPrefectures({ locale: "el", includeMountAthos: true })).toEqual(expectedData);
    expect(getPrefectures({ includeMountAthos: true }).length).toBe(55);
  });

  it("correctly returns data (in english language)", () => {
    const expectedData = prefecturesWithoutMountAthos.en;

    expect(getPrefectures({ locale: "en" })).toEqual(expectedData);
    expect(getPrefectures({ locale: "en", includeMountAthos: false })).toEqual(expectedData);
    expect(getPrefectures().length).toBe(54);
  });

  it("correctly returns data including Mount Athos (in english language)", () => {
    const expectedData = prefectures.en;

    expect(getPrefectures({ locale: "en", includeMountAthos: true })).toEqual(expectedData);
    expect(getPrefectures({ locale: "en", includeMountAthos: true }).length).toBe(55);
  });
});

describe("getPrefectureById", () => {
  it("correctly returns prefecture with default values (in greek language)", () => {
    const expectedData = prefecturesWithoutMountAthos.el[0];

    expect(getPrefectureById({ id: 1 })).toEqual(expectedData);
    expect(getPrefectureById({ id: 1, locale: "el" })).toEqual(expectedData);
    expect(getPrefectureById({ id: 1, includeMountAthos: false })).toEqual(expectedData);
    // all default options
    expect(getPrefectureById({ id: 1, locale: "el", includeMountAthos: false })).toEqual(expectedData);
  });

  it("correctly returns Mount Athos prefecture (in greek language)", () => {
    const expectedData = prefectures.el[54];

    expect(getPrefectureById({ id: 55, includeMountAthos: true })).toEqual(expectedData);
    expect(getPrefectureById({ id: 55, locale: "el", includeMountAthos: true })).toEqual(expectedData);
  });

  it("correctly returns prefecture (in english language)", () => {
    const expectedData = prefecturesWithoutMountAthos.en[33];

    expect(getPrefectureById({ id: 34, locale: "en" })).toEqual(expectedData);
    expect(getPrefectureById({ id: 34, locale: "en", includeMountAthos: false })).toEqual(expectedData);
  });

  it("correctly returns Mount Athos prefecture (in english language)", () => {
    const expectedData = prefectures.en[54];

    expect(getPrefectureById({ id: 55, locale: "en", includeMountAthos: true })).toEqual(expectedData);
  });
});

describe("getAllPostalCodes", () => {
  it("correctly returns all available postal codes", () => {
    const expectedResult = postalCodes.flatMap(({ postalCodes }) => postalCodes);

    expect(getAllPostalCodes()).toEqual(expectedResult);
    expect(getAllPostalCodes().length).toBe(1290);
  });
});

describe("findByPostalCode", () => {
  it("correctly returns undefined in case of invalid postal code", () => {
    expect(findByPostalCode("12345")).toBe(undefined);
    expect(findByPostalCode("11111", { locale: "en" })).toBe(undefined);
    expect(findByPostalCode("22222", { locale: "en", entity: "prefecture" })).toBe(undefined);
    expect(findByPostalCode("99999", { locale: "el" })).toBe(undefined);
    expect(findByPostalCode("98765")).toBe(undefined);
    expect(findByPostalCode("56789", { locale: "el", entity: "prefecture" })).toBe(undefined);
  });

  it("correctly returns prefecture (en and el languages)", () => {
    expect(findByPostalCode("17562")).toEqual({
      id: 1,
      name: "Νομός Αθηνών",
      seat: "Αθήνα",
      regionAndUnit: { regionId: 9, regionIso31662: "GR-I", unitId: 42 },
    });
    expect(findByPostalCode("30005", { locale: "en" })).toEqual({
      id: 49,
      name: "Aetolia-Acarnania",
      seat: "Messolonghi",
      regionAndUnit: { regionId: 7, regionIso31662: "GR-G", unitId: 32 },
    });
    expect(findByPostalCode("17122", { locale: "en", entity: "prefecture" })).toEqual({
      id: 1,
      name: "Athens Prefecture",
      seat: "Athens",
      regionAndUnit: { regionId: 9, regionIso31662: "GR-I", unitId: 42 },
    });
    expect(findByPostalCode("25008", { locale: "el" })).toEqual({
      id: 48,
      name: "Νομός Αχαΐας",
      seat: "Πάτρα",
      regionAndUnit: {
        regionId: 7,
        regionIso31662: "GR-G",
        unitId: 33,
      },
    });
    expect(findByPostalCode("68014", { locale: "el", entity: "prefecture" })).toEqual({
      id: 22,
      name: "Νομός Έβρου",
      seat: "Αλεξανδρούπολη",
      regionAndUnit: {
        regionId: 1,
        regionIso31662: "GR-A",
        unitId: 2,
      },
    });
    expect(findByPostalCode("27066")).toEqual({
      id: 50,
      name: "Νομός Ηλείας",
      seat: "Πύργος",
      regionAndUnit: {
        regionId: 7,
        regionIso31662: "GR-G",
        unitId: 34,
      },
    });
    expect(findByPostalCode("54250", { locale: "en" })).toEqual({
      id: 16,
      name: "Thessaloniki",
      seat: "Thessaloniki",
      regionAndUnit: {
        regionId: 2,
        regionIso31662: "GR-B",
        unitId: 8,
      },
    });
  });

  it("correctly returns region (en and el languages)", () => {
    expect(findByPostalCode("17562", { entity: "region" })).toEqual({
      id: 9,
      iso31662: "GR-I",
      name: "Αττικής",
      seat: "Αθήνα",
    });
    expect(findByPostalCode("30005", { locale: "en", entity: "region" })).toEqual({
      id: 7,
      iso31662: "GR-G",
      name: "Western Greece",
      seat: "Patras",
    });
    expect(findByPostalCode("17122", { locale: "en", entity: "region" })).toEqual({
      id: 9,
      iso31662: "GR-I",
      name: "Attica",
      seat: "Athens",
    });
    expect(findByPostalCode("25008", { locale: "el", entity: "region" })).toEqual({
      id: 7,
      iso31662: "GR-G",
      name: "Δυτικής Ελλάδας",
      seat: "Πάτρα",
    });
    expect(findByPostalCode("68014", { locale: "el", entity: "region" })).toEqual({
      id: 1,
      iso31662: "GR-A",
      name: "Ανατολικής Μακεδονίας και Θράκης",
      seat: "Κομοτηνή",
    });
    expect(findByPostalCode("27066", { entity: "region" })).toEqual({
      id: 7,
      iso31662: "GR-G",
      name: "Δυτικής Ελλάδας",
      seat: "Πάτρα",
    });
    expect(findByPostalCode("54250", { locale: "en", entity: "region" })).toEqual({
      id: 2,
      iso31662: "GR-B",
      name: "Central Macedonia",
      seat: "Thessaloniki",
    });
  });

  it("correctly returns unit (en and el languages)", () => {
    expect(findByPostalCode("17562", { entity: "unit" })).toEqual({
      id: 42,
      name: "Κεντρικού Τομέα Αθηνών",
      seat: "Αθήνα",
      region: {
        id: 9,
        iso31662: "GR-I",
      },
      carPlatesPattern: [],
    });
    expect(findByPostalCode("30005", { locale: "en", entity: "unit" })).toEqual({
      id: 32,
      name: "Aetolia - Acarnania",
      seat: "Messolonghi",
      region: {
        id: 7,
        iso31662: "GR-G",
      },
      carPlatesPattern: ["AI*", "ME*"],
    });
    expect(findByPostalCode("17122", { locale: "en", entity: "unit" })).toEqual({
      id: 42,
      name: "Central Athens",
      seat: "Athens",
      region: {
        id: 9,
        iso31662: "GR-I",
      },
      carPlatesPattern: [],
    });
    expect(findByPostalCode("25008", { locale: "el", entity: "unit" })).toEqual({
      id: 33,
      name: "Αχαΐας",
      seat: "Πάτρα",
      region: {
        id: 7,
        iso31662: "GR-G",
      },
      carPlatesPattern: ["AX*", "AZ*"],
    });
    expect(findByPostalCode("68014", { locale: "el", entity: "unit" })).toEqual({
      id: 2,
      name: "Έβρου",
      seat: "Αλεξανδρούπολη",
      region: {
        id: 1,
        iso31662: "GR-A",
      },
      carPlatesPattern: ["EB*", "MX*", "OP*"],
    });
    expect(findByPostalCode("27066", { entity: "unit" })).toEqual({
      id: 34,
      name: "Ηλείας",
      seat: "Πύργος",
      region: {
        id: 7,
        iso31662: "GR-G",
      },
      carPlatesPattern: [],
    });
    expect(findByPostalCode("54250", { locale: "en", entity: "unit" })).toEqual({
      id: 8,
      name: "Thessaloniki",
      seat: "Thessaloniki",
      region: {
        id: 2,
        iso31662: "GR-B",
      },
      carPlatesPattern: ["N*"],
    });
  });
});

describe("getAllTaxOffices", () => {
  it("corectly returns all tax offices data (in greek)", () => {
    expect(getAllTaxOffices()).toEqual(taxOfficesEl);
  });

  it("corectly returns all tax offices data (in english)", () => {
    expect(getAllTaxOffices({ locale: "en" })).toEqual(taxOfficesEn);
  });
});

describe("getTaxOfficeById", () => {
  it("returns undefined if tax office ID is invalid", () => {
    expect(getTaxOfficeById({ id: 1120 })).toBeUndefined();
  });

  it("returns tax office data if tax office ID is valid", () => {
    expect(getTaxOfficeById({ id: 1 })).toEqual({
      id: 1,
      name: "Ξάνθης",
      officialName: "ΔΟΥ Ξάνθης",
      relations: {
        regionId: 1,
        regionIso: "GR-A",
        unitIds: [5],
        municipalityIds: [15, 16, 17, 18],
      },
      postalCodes: [67064, 67150, 67300, 67131, 67133, 67132, 67062, 66035, 66150, 69200, 67200],
    });
  });
});

describe("getTaxOfficesByRegionId", () => {
  it("get tax offices with region id 1", () => {
    expect(getTaxOfficesByRegionId({ id: 1 })).toEqual([
      {
        id: 1,
        name: "Ξάνθης",
        officialName: "ΔΟΥ Ξάνθης",
        relations: {
          regionId: 1,
          regionIso: "GR-A",
          unitIds: [5],
          municipalityIds: [15, 16, 17, 18],
        },
        postalCodes: [67064, 67150, 67300, 67131, 67133, 67132, 67062, 66035, 66150, 69200, 67200],
      },
      {
        id: 27,
        name: "Αλεξανδρούπολης ",
        officialName: "ΔΟΥ Αλεξανδρούπολης ",
        relations: {
          regionId: 1,
          regionIso: "GR-A",
          unitIds: [2],
          municipalityIds: [6, 9, 10],
        },
        postalCodes: [68132, 68131, 68133, 68150, 68500, 69300, 68002, 68004, 68400, 68003],
      },
      {
        id: 50,
        name: "Κομοτηνής",
        officialName: "ΔΟΥ Κομοτηνής",
        relations: {
          regionId: 1,
          regionIso: "GR-A",
          unitIds: [6],
          municipalityIds: [19, 20, 21, 22],
        },
        postalCodes: [69300, 69150, 69200, 69132, 69131, 69133, 69400],
      },
      {
        id: 63,
        name: "Ορεστιάδας",
        officialName: "ΔΟΥ Ορεστιάδας",
        relations: {
          regionId: 1,
          regionIso: "GR-A",
          unitIds: [2],
          municipalityIds: [7, 8, 10],
        },
        postalCodes: [68010, 68300, 68200, 68006, 68007, 68400, 68004],
      },
      {
        id: 67,
        name: "Δράμας",
        officialName: "ΔΟΥ Δράμας",
        relations: {
          regionId: 1,
          regionIso: "GR-A",
          unitIds: [1],
          municipalityIds: [1, 2, 3, 4, 5],
        },
        postalCodes: [66031, 66300, 66131, 66132, 66133, 66150, 66033, 66035, 66200, 62042],
      },
      {
        id: 75,
        name: "Καβάλας",
        officialName: "ΔΟΥ Καβάλας",
        relations: {
          regionId: 1,
          regionIso: "GR-A",
          unitIds: [4, 3],
          municipalityIds: [14, 11, 12, 13],
        },
        postalCodes: [
          64010, 64004, 64002, 64005, 65404, 65302, 65403, 65201, 65500, 64006, 64003, 64200, 64009, 64007, 64100,
          64008,
        ],
      },
    ]);
  });

  it("get tax offices with region id 8", () => {
    expect(getTaxOfficesByRegionId({ id: 8 })).toEqual([
      {
        id: 13,
        name: "Καρπενησίου (Α-Β)",
        officialName: "ΔΟΥ Καρπενησίου (Α-Β)",
        relations: {
          regionId: 8,
          regionIso: "GR-H",
          unitIds: [37],
          municipalityIds: [162, 161],
        },
        postalCodes: [36071, 36072, 36073, 36100, 43150, 36076, 36074, 36080],
      },
      {
        id: 28,
        name: "Λειβαδιάς (Α)",
        officialName: "ΔΟΥ Λειβαδιάς (Α)",
        relations: {
          regionId: 8,
          regionIso: "GR-H",
          unitIds: [35],
          municipalityIds: [149, 152, 151, 150],
        },
        postalCodes: [32001, 32003, 32004, 32005, 32131, 32150, 32006, 32300],
      },
      {
        id: 29,
        name: "Θηβών (Α-Β)",
        officialName: "ΔΟΥ Θηβών (Α-Β)",
        relations: {
          regionId: 8,
          regionIso: "GR-H",
          unitIds: [35, 36],
          municipalityIds: [149, 148, 150, 147],
        },
        postalCodes: [32001, 32200, 32010, 32300, 34150, 32009],
      },
      {
        id: 37,
        name: "Λαμίας (Α)",
        officialName: "ΔΟΥ Λαμίας (Α)",
        relations: {
          regionId: 8,
          regionIso: "GR-H",
          unitIds: [38],
          municipalityIds: [164, 169, 165, 166, 163, 168],
        },
        postalCodes: [
          35015, 35002, 33057, 35200, 35010, 35009, 35006, 35008, 35132, 35133, 35150, 35131, 35003, 35011, 35001,
          35005, 35017, 35300,
        ],
      },
      {
        id: 62,
        name: "Άμφισσας (Α-Β)",
        officialName: "ΔΟΥ Άμφισσας (Α-Β)",
        relations: {
          regionId: 8,
          regionIso: "GR-H",
          unitIds: [39],
          municipalityIds: [170, 171],
        },
        postalCodes: [33100, 33058, 33200, 33053, 33057, 33054, 32004, 33056],
      },
      {
        id: 66,
        name: "Χαλκίδας (Α)",
        officialName: "ΔΟΥ Χαλκίδας (Α)",
        relations: {
          regionId: 8,
          regionIso: "GR-H",
          unitIds: [36],
          municipalityIds: [156, 158, 154, 159, 155, 157],
        },
        postalCodes: [
          34600, 34400, 34008, 34006, 34200, 34300, 34005, 34004, 34132, 34133, 34150, 34131, 34002, 32009, 32200,
        ],
      },
      {
        id: 83,
        name: "Κύμης (Β)",
        officialName: "ΔΟΥ Κύμης (Β)",
        relations: {
          regionId: 8,
          regionIso: "GR-H",
          unitIds: [36],
          municipalityIds: [160, 159, 153],
        },
        postalCodes: [34001, 34013, 34015, 34009, 34003, 34500, 34007],
      },
    ]);
  });

  it("returns empty array on invalid region id", () => {
    expect(getTaxOfficesByRegionId({ id: 1000000000 })).toEqual([]);
  });
});

describe("getTaxOfficesByUnitId", () => {
  it("get tax offices with unit id 1", () => {
    expect(getTaxOfficesByUnitId({ id: 1 })).toEqual([
      {
        id: 67,
        name: "Δράμας",
        officialName: "ΔΟΥ Δράμας",
        relations: {
          regionId: 1,
          regionIso: "GR-A",
          unitIds: [1],
          municipalityIds: [1, 2, 3, 4, 5],
        },
        postalCodes: [66031, 66300, 66131, 66132, 66133, 66150, 66033, 66035, 66200, 62042],
      },
    ]);
  });

  it("get tax offices with unit id 26", () => {
    expect(getTaxOfficesByUnitId({ id: 26 })).toEqual([
      {
        id: 80,
        name: "Τρικάλων",
        officialName: "ΔΟΥ Τρικάλων",
        relations: {
          regionId: 5,
          regionIso: "GR-E",
          unitIds: [26],
          municipalityIds: [114, 113, 115, 116],
        },
        postalCodes: [42200, 42032, 42150, 42132, 42131, 42031, 43200],
      },
    ]);
  });

  it("returns empty array on invalid unit id", () => {
    expect(getTaxOfficesByUnitId({ id: 1000000000 })).toEqual([]);
  });
});

describe("getTaxOfficesByMunicipalityId", () => {
  it("get tax offices with municipality id 1", () => {
    expect(getTaxOfficesByMunicipalityId({ id: 1 })).toEqual([
      {
        id: 67,
        name: "Δράμας",
        officialName: "ΔΟΥ Δράμας",
        relations: {
          regionId: 1,
          regionIso: "GR-A",
          unitIds: [1],
          municipalityIds: [1, 2, 3, 4, 5],
        },
        postalCodes: [66031, 66300, 66131, 66132, 66133, 66150, 66033, 66035, 66200, 62042],
      },
    ]);
  });

  it("get tax offices with municipality id 160", () => {
    expect(getTaxOfficesByMunicipalityId({ id: 160 })).toEqual([
      {
        id: 83,
        name: "Κύμης (Β)",
        officialName: "ΔΟΥ Κύμης (Β)",
        relations: {
          regionId: 8,
          regionIso: "GR-H",
          unitIds: [36],
          municipalityIds: [160, 159, 153],
        },
        postalCodes: [34001, 34013, 34015, 34009, 34003, 34500, 34007],
      },
    ]);
  });

  it("returns empty array on invalid municipality id", () => {
    expect(getTaxOfficesByMunicipalityId({ id: 10000000 })).toEqual([]);
  });
});

describe("getTaxOfficesByPostalCode", () => {
  it("get tax offices with postal code 11526", () => {
    expect(getTaxOfficesByPostalCode({ postalCode: 11526 })).toEqual([
      {
        id: 21,
        name: "ΙΒ' Αθηνών",
        officialName: "ΔΟΥ ΙΒ' Αθηνών",
        relations: {
          regionId: 9,
          regionIso: "GR-I",
          unitIds: [42],
          municipalityIds: [193, 198],
        },
        postalCodes: [11527, 11526, 11528, 15772, 15773, 15771],
      },
    ]);
  });

  it("get tax offices with postal code 67064", () => {
    expect(getTaxOfficesByPostalCode({ postalCode: 67064 })).toEqual([
      {
        id: 1,
        name: "Ξάνθης",
        officialName: "ΔΟΥ Ξάνθης",
        relations: {
          regionId: 1,
          regionIso: "GR-A",
          unitIds: [5],
          municipalityIds: [15, 16, 17, 18],
        },
        postalCodes: [67064, 67150, 67300, 67131, 67133, 67132, 67062, 66035, 66150, 69200, 67200],
      },
    ]);
  });

  it("returns empty array on invalid postalcode", () => {
    expect(getTaxOfficesByPostalCode({ postalCode: 11111111111 })).toEqual([]);
  });
});

describe("searchTaxOffice", () => {
  it("returns empty array on empty searchTerm", () => {
    expect(searchTaxOffice({ searchTerm: "     " })).toEqual([]);
  });

  it("returns tax office that has 'ΑΘ' in their names", () => {
    expect(searchTaxOffice({ searchTerm: "ΑΘ" })).toEqual([
      {
        id: 16,
        name: "Α' Αθηνών",
        officialName: "ΔΟΥ Α' Αθηνών",
        postalCodes: [
          10431, 10432, 10677, 11851, 10443, 10551, 10554, 11854, 11853, 11852, 11742, 10442, 11855, 10435, 10436,
          10437, 10444, 10556, 10560, 11741, 10447, 10438, 10555, 10553, 10440, 10558, 10552, 10441, 10559, 10564,
          10678, 10679, 10439, 17778,
        ],
        relations: { municipalityIds: [193, 199, 187], regionId: 9, regionIso: "GR-I", unitIds: [42, 43, 41] },
      },
      {
        id: 17,
        name: "Δ' Αθηνών",
        officialName: "ΔΟΥ Δ' Αθηνών",
        postalCodes: [
          10433, 10434, 10682, 11472, 11473, 11471, 10563, 10671, 10672, 10683, 10675, 10676, 10557, 10673, 10674,
          10680, 10681, 10562, 10561,
        ],
        relations: { municipalityIds: [193], regionId: 9, regionIso: "GR-I", unitIds: [42] },
      },
      {
        id: 18,
        name: "ΙΓ' Αθηνών",
        officialName: "ΔΟΥ ΙΓ' Αθηνών",
        postalCodes: [
          11251, 11257, 11476, 11142, 10446, 11252, 11474, 10445, 11255, 11256, 11361, 11364, 11141, 11144, 11253,
          11254, 11363, 11145, 11362, 11475, 11143, 11146, 11147,
        ],
        relations: { municipalityIds: [193, 192], regionId: 9, regionIso: "GR-I", unitIds: [42] },
      },
      {
        id: 19,
        name: "ΙΖ' Αθηνών",
        officialName: "ΔΟΥ ΙΖ' Αθηνών",
        postalCodes: [11631, 11632, 11744, 11635, 11633, 11636, 11743, 11634, 11745, 16121, 16233, 16231, 16232, 16122],
        relations: { municipalityIds: [193, 196, 197], regionId: 9, regionIso: "GR-I", unitIds: [42] },
      },
      {
        id: 21,
        name: "ΙΒ' Αθηνών",
        officialName: "ΔΟΥ ΙΒ' Αθηνών",
        postalCodes: [11527, 11526, 11528, 15772, 15773, 15771],
        relations: { municipalityIds: [193, 198], regionId: 9, regionIso: "GR-I", unitIds: [42] },
      },
      { id: 95, name: "ΦAE Αθηνών (Α1)", officialName: "ΔΟΥ ΦAE Αθηνών (Α1)", relations: {} },
    ]);
  });

  it("returns tax office that has 'ATH' in their names", () => {
    expect(searchTaxOffice({ searchTerm: "ATH", locale: "en" })).toEqual([
      {
        id: 16,
        name: "A' Athens",
        officialName: "TAX OFFICE A' Athens",
        postalCodes: [
          10431, 10432, 10677, 11851, 10443, 10551, 10554, 11854, 11853, 11852, 11742, 10442, 11855, 10435, 10436,
          10437, 10444, 10556, 10560, 11741, 10447, 10438, 10555, 10553, 10440, 10558, 10552, 10441, 10559, 10564,
          10678, 10679, 10439, 17778,
        ],
        relations: { municipalityIds: [193, 199, 187], regionId: 9, regionIso: "GR-I", unitIds: [42, 43, 41] },
      },
      {
        id: 17,
        name: "D' Athens",
        officialName: "TAX OFFICE D' Athens",
        postalCodes: [
          10433, 10434, 10682, 11472, 11473, 11471, 10563, 10671, 10672, 10683, 10675, 10676, 10557, 10673, 10674,
          10680, 10681, 10562, 10561,
        ],
        relations: { municipalityIds: [193], regionId: 9, regionIso: "GR-I", unitIds: [42] },
      },
      {
        id: 18,
        name: "ΙC' Athens",
        officialName: "TAX OFFICE IC' Athens",
        postalCodes: [
          11251, 11257, 11476, 11142, 10446, 11252, 11474, 10445, 11255, 11256, 11361, 11364, 11141, 11144, 11253,
          11254, 11363, 11145, 11362, 11475, 11143, 11146, 11147,
        ],
        relations: { municipalityIds: [193, 192], regionId: 9, regionIso: "GR-I", unitIds: [42] },
      },
      {
        id: 19,
        name: "IZ' Athens",
        officialName: "TAX OFFICE IZ' Athens",
        postalCodes: [11631, 11632, 11744, 11635, 11633, 11636, 11743, 11634, 11745, 16121, 16233, 16231, 16232, 16122],
        relations: { municipalityIds: [193, 196, 197], regionId: 9, regionIso: "GR-I", unitIds: [42] },
      },
      {
        id: 21,
        name: "IB' Athens",
        officialName: "TAX OFFICE IB' Athens",
        postalCodes: [11527, 11526, 11528, 15772, 15773, 15771],
        relations: { municipalityIds: [193, 198], regionId: 9, regionIso: "GR-I", unitIds: [42] },
      },
      { id: 95, name: "FAE Athens (A1)", officialName: "TAX OFFICE FAE Athens (A1)", relations: {} },
    ]);
  });
});
