

const url = "http://localhost:64827";

export const URL = {

    main_URL : url,

    part_url : url+"/api/parts?",
    analog_url : url+"/api/parts?analog=",
    currency_url : url+"/api/parts?rate",
    contact_url: url + "/api/contact"
};

export default URL;