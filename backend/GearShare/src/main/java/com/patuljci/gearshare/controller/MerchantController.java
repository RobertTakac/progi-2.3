package com.patuljci.gearshare.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MerchantController {

    @RequestMapping(method=RequestMethod.POST, value="/")
    public void createAdvertisement(@RequestBody oglas oglas){

    }

}
