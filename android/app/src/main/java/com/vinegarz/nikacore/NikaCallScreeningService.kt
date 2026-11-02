package com.vinegarz.nikacore

import android.telecom.Call
import android.telecom.CallScreeningService

class NikaCallScreeningService : CallScreeningService() {
    override fun onScreenCall(callDetails: Call.Details) {
        val phone = callDetails.handle?.schemeSpecificPart.orEmpty()
        val match = LocalDirectory.lookup(phone)
        val shouldSilence = (match?.spamScore ?: 0) >= 80

        val response = CallResponse.Builder()
            .setDisallowCall(false)
            .setRejectCall(false)
            .setSilenceCall(shouldSilence)
            .build()

        respondToCall(callDetails, response)
    }
}
