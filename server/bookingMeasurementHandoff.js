import { createHash } from 'node:crypto';
import { siteContext } from '../shared/siteMeasurement.js';
// Preflight only. No endpoint, writes or booking counter. Not wired to production.
// A future adapter must read a committed operational confirmation + recorded grant,
// implement durable idempotence/cancellation and obtain separate mapping approval.
export function prepareBookingMeasurementHandoff(record,now=Date.now()){
    if(!record || record.confirmed!==true || record.cancelled!==false || record.serverVerified!==true
        || record.source!=='personal_appointment_ledger' || typeof record.reference!=='string'
        || !/^[A-Za-z0-9_-]{8,100}$/.test(record.reference) || record.consentActive!==true)return null;
    const context=siteContext(record.context,now);if(!context)return null;
    return {context,confirmationHash:createHash('sha256').update('site-booking:'+record.reference).digest('hex')};
}
export const bookingMeasurementAvailability=Object.freeze({status:'not_instrumented',
    reason:'No committed personal-appointment confirmation and consented attribution mapping verified. No public booking event accepted.'});
