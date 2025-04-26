import { useContext } from "react"
import ThermalPrinterModule from "react-native-thermal-printer"
import { fileStorage, loginStorage } from "../../storage/appStorage"
import { AppStore } from "../../context/AppContext"
import {
    CalculatorShowBillData,
    CancelledBillsReportData,
    CancelledBillsReportResponse,
    CollectionReport,
    CreditReportResponseData,
    CustomerLedgerData,
    DaybookReportData,
    DueReportData,
    GstStatement,
    GstSummary,
    ItemReportData,
    ItemsData,
    RecoveryAmountResponseData,
    RecoveryReportData,
    RefundReportData,
    SaleReport,
    SaleReportCalculateModeData,
    ShowBillData,
    StockReportResponse,
    UserwiseReportData,
} from "../../models/api_types"
import { gstFilterationAndTotals } from "../../utils/gstFilterTotal"
import { gstFilterationAndTotalForRePrint } from "../../utils/gstFilterTotalForRePrint"
import useCalculations from "../useCalculations"
import usePrintCalculations from "../usePrintCalculations"
import { AppStoreContext, Bill } from "../../models/custom_types"

export const useThermalPrint = () => {
    const { receiptSettings } = useContext<AppStoreContext>(AppStore)
    const {
        netTotalWithGSTCalculate,
        roundingOffWithGSTCalculate,
        grandTotalWithGSTCalculate,
        roundingOffCalculate,
        grandTotalCalculate,
        netTotalCalculate,

        totalAmountWithGSTInclCalculate,
        netTotalWithGSTInclCalculate,
        roundingOffWithGSTInclCalculate,
        grandTotalWithGSTInclCalculate,
    } = useCalculations()

    const {
        calculatePercentDiscountPerProduct,
        calculateAmountAfterPercentDiscountPerProduct,
        calculateAmountDiscountPerProduct,
        calculateAmountAfterAmountDiscountPerProduct,
    } = usePrintCalculations()

    // async function printReceipt(
    //     addedProducts: ItemsData[],
    //     netTotal: number,
    //     totalDiscountAmount: number,
    //     cashAmount?: number,
    //     returnedAmt?: number,
    //     customerName?: string,
    //     customerPhone?: string,
    //     rcptNo?: number,
    //     paymentMode?: string,
    //     kotNo?: number,
    //     tableNo?: number
    // ) {
    //     const loginStore = JSON.parse(loginStorage.getString("login-data"));
    //     const fileStore = fileStorage.getString("file-data");
    //     const upiData = fileStorage.getString("upi-data");

    //     const shopName = loginStore.company_name.toString();
    //     const cashier = loginStore.user_name.toString();

    //     let totalQuantities = 0;
    //     let payload = "";

    //     try {
    //         if (receiptSettings?.kot_flag === "Y" && tableNo) {
    //             payload +=
    //                 `[C]<font size='normal'>${shopName.toUpperCase()}</font>\n` +
    //                 `[C]------------------------\n` +
    //                 `[L]KOT NO.[R]${kotNo}\n` +
    //                 `[L]TABLE NO.[R]${tableNo}\n` +
    //                 `[L]DT.[R]${new Date().toLocaleString("en-GB")}\n` +
    //                 `[C]------------------------\n` +
    //                 `[L]ITEM[R]QTY\n`;
    //             for (const item of addedProducts) {
    //                 payload += item.item_name.length > 10
    //                     ? `[L]${item.item_name}\n[R]${item.quantity}\n`
    //                     : `[L]${item.item_name}[R]${item.quantity}\n`;
    //             }
    //             payload += `[C]------------------------\n`;
    //         }

    //         if (fileStore) {
    //             payload += `[C]<img>${fileStore}</img>\n`;
    //         }

    //         payload += `[C]${shopName.toUpperCase()}\n`;
    //         if (receiptSettings?.on_off_flag1 === "Y") payload += `[C]${receiptSettings.header1}\n`;
    //         if (receiptSettings?.on_off_flag2 === "Y") payload += `[C]${receiptSettings.header2}\n`;
    //         payload += `[C]RECEIPT\n[C]------------------------\n`;

    //         payload +=
    //             `[L]RCPT.NO: ${rcptNo}\n` +
    //             `[L]DATE    : ${new Date().toLocaleString("en-GB")}\n` +
    //             `[L]CASHIER : ${cashier}\n` +
    //             `[C]------------------------\n`;

    //         if (customerName || customerPhone) {
    //             if (receiptSettings?.cust_inf === "Y") payload += `[L]NAME : ${customerName}\n`;
    //             payload += `[L]PHONE: ${customerPhone}\n[C]------------------------\n`;
    //         }

    //         const hasDiscount = receiptSettings?.discount_flag === "Y" && receiptSettings.discount_position !== "B";
    //         payload += hasDiscount
    //             ? `[L]ITEM\n[L]QTY[L]PRC[R]DIS[R]AMT\n`
    //             : `[L]ITEM\n[L]QTY[C]PRC[R]AMT\n`;
    //         payload += `[C]------------------------\n`;

    //         for (const item of addedProducts) {
    //             // @ts-ignore
    //             totalQuantities += parseInt(item.quantity, 10);
    //             payload += `[L]${item.item_name}\n`;
    //             if (hasDiscount) {
    //                 if (receiptSettings.discount_type === "P") {
    //                     payload +=
    //                         `[L]${item.quantity}[L]${item.price}[R]${calculatePercentDiscountPerProduct(
    //                             item.price,
    //                             item.quantity,
    //                             item.discount
    //                         )}[R]${calculateAmountAfterPercentDiscountPerProduct(
    //                             item.price,
    //                             item.quantity,
    //                             item.discount
    //                         )}\n`;
    //                 } else {
    //                     payload +=
    //                         `[L]${item.quantity}[L]${item.price}[R]${calculateAmountDiscountPerProduct(
    //                             item.quantity,
    //                             item.discount
    //                         )}[R]${calculateAmountAfterAmountDiscountPerProduct(
    //                             item.price,
    //                             item.quantity,
    //                             item.discount
    //                         )}\n`;
    //                 }
    //             } else {
    //                 payload +=
    //                     `[L]${item.quantity}[C]${item.price}[R]${calculateAmountAfterAmountDiscountPerProduct(
    //                         item.price,
    //                         item.quantity,
    //                         0
    //                     )}\n`;
    //             }
    //         }

    //         payload +=
    //             `[C]------------------------\n` +
    //             `[L]ITEMS: ${addedProducts.length}[C]QTY: ${totalQuantities}[R]AMT: ${netTotal.toFixed(2)}\n`;
    //         if (receiptSettings?.discount_flag === "Y") payload += `[L]DISCOUNT[C]:[R]${totalDiscountAmount.toFixed(2)}\n`;
    //         payload +=
    //             `[L]TOTAL[C]:[R]${netTotalCalculate(netTotal, totalDiscountAmount)}\n` +
    //             `[L]ROUND OFF[C]:[R]${roundingOffCalculate(netTotal, totalDiscountAmount)}\n` +
    //             `[L]NET AMT[C]:[R]${grandTotalCalculate(netTotal, totalDiscountAmount)}\n`;
    //         payload += `[C]------------------------\n`;

    //         if (receiptSettings?.rcv_cash_flag === "Y" && paymentMode === "C") {
    //             payload +=
    //                 `[C]PAYMENT MODE\n` +
    //                 `[C]CASH RECEIVED: ${cashAmount}\n` +
    //                 `[C]RETURNED AMT: ${returnedAmt}\n` +
    //                 `[C]------------------------\n`;
    //         }

    //         if (paymentMode === "U") {
    //             payload +=
    //                 `[C]RECEIVED: ${grandTotalCalculate(netTotal, totalDiscountAmount)} [UPI]\n` +
    //                 `[C]------------------------\n`;
    //             if (upiData) payload += `[C]<qrcode size='20'>${upiData}&am=${grandTotalCalculate(
    //                 netTotal,
    //                 totalDiscountAmount
    //             )}</qrcode>\n`;
    //         }

    //         if (paymentMode === "D") {
    //             payload +=
    //                 `[C]RECEIVED: ${grandTotalCalculate(netTotal, totalDiscountAmount)} [CARD]\n` +
    //                 `[C]------------------------\n`;
    //         }

    //         if (paymentMode === "R") {
    //             payload +=
    //                 `[C]PAYMENT MODE\n` +
    //                 `[C]CASH RECEIVED: ${cashAmount}\n` +
    //                 `[C]DUE AMT: ${Math.abs(returnedAmt)}\n` +
    //                 `[C]------------------------\n`;
    //         }

    //         if (receiptSettings?.on_off_flag3 === "Y") payload += `[C]${receiptSettings.footer1}\n`;
    //         if (receiptSettings?.on_off_flag4 === "Y") payload += `[C]${receiptSettings.footer2}\n`;
    //         payload += `[C]------X------\n`;
    //         payload += `[C]             \n`;
    //         payload += `[C]             \n`;

    //         await ThermalPrinterModule.printBluetooth({
    //             payload,
    //             printerNbrCharactersPerLine: 32,
    //             printerDpi: 120,
    //             printerWidthMM: 58,
    //             mmFeedPaper: 25
    //         });
    //     } catch (e) {
    //         console.log(e.message || "ERROR");
    //     }
    // }

    async function printReceiptWithoutGst(
        addedProducts: ItemsData[],
        netTotal: number,
        totalDiscountAmount: number,
        cashAmount?: number,
        returnedAmt?: number,
        customerName?: string,
        customerPhone?: string,
        rcptNo?: number,
        paymentMode?: string,
        kotNo?: number,
        tableNo?: number,
    ) {
        const loginStore = JSON.parse(loginStorage.getString("login-data"))
        const fileStore = fileStorage.getString("file-data")
        const upiStore = fileStorage.getString("upi-blob")
        const upiData = fileStorage.getString("upi-data")

        const shopName: string = loginStore?.company_name?.toString()
        const address: string = loginStore?.address?.toString()
        const location: string = loginStore?.branch_name?.toString()
        const shopMobile: string = loginStore?.phone_no?.toString()
        const shopEmail: string = loginStore?.email_id?.toString()
        const cashier: string = loginStore?.user_name?.toString()

        let totalQuantities: number = 0
        let totalAmountAfterDiscount: number = 0
        let payload: string = ""

        try {
            if (receiptSettings?.kot_flag === "Y") {
                let payload = `[C]<font size='normal'>${shopName.toUpperCase()}</font>\n` +
                    `[C]------------------------\n` +
                    `[L]KOT NO.[R]${kotNo}\n` +
                    `[L]TABLE NO.[R]${tableNo}\n` +
                    `[L]DT.[R]${new Date().toLocaleString("en-GB")}\n` +
                    `[C]------------------------\n` +
                    `[L]ITEM[R]QTY\n`;

                for (const item of addedProducts) {
                    if (item?.item_name?.length > 10) {
                        payload += `[L]${item?.item_name}\n` +
                            `[R]${item?.quantity}`;
                    } else {
                        payload += `[L]${item?.item_name}[R]${item?.quantity}\n`
                    }
                }

                payload += `[L]                        \n` +
                    `[C]------------------------\n` +
                    `[C]                        \n` +
                    `[C]                        \n`;
            }

            payload += `[C]${shopName.toUpperCase()}\n`;

            if (receiptSettings?.on_off_flag1 === "Y") {
                payload += `[C]${receiptSettings?.header1}\n`
            }

            if (receiptSettings?.on_off_flag2 === "Y") {
                payload += `[C]${receiptSettings?.header2}\n`
            }

            payload += `[C]RECEIPT\n` +
                `[C]------------------------\n` +
                `[L]RCPT.NO: ${rcptNo?.toString()}\n` +
                `[L]DATE: ${new Date().toLocaleString("en-GB")}\n` +
                `[L]CASHIER: ${cashier}\n` +
                `[C]------------------------\n`;


            if (customerName.length !== 0 || customerPhone.length !== 0) {
                receiptSettings?.cust_inf === "Y" &&
                    (payload += `[L]NAME: ${customerName}\n`)
                payload += `[L]PHONE: ${customerPhone}\n` +
                    `[C]------------------------\n`;
            }

            receiptSettings?.discount_flag === "Y" &&
                receiptSettings?.discount_position !== "B"
                ?
                payload += `[L]ITEM\n` +
                `[L]QTY[L]PRC[R]DIS[R]AMT\n`
                :
                payload += `[L]ITEM\n` +
                `[L]QTY[C]PRC[R]AMT\n`

            payload += `[C]------------------------\n`;



            for (const item of addedProducts) {
                //@ts-ignore
                totalQuantities += parseInt(item?.quantity)

                console.log("##########@@@@@@@@@@@@@@@", item)

                if (item?.item_name?.length >= 0) {
                    payload += `[L]${item?.item_name}\n`;

                    receiptSettings?.discount_flag === "Y" &&
                        receiptSettings?.discount_position !== "B"
                        ? receiptSettings?.discount_type === "P"
                            ?
                            payload += `[L]${item?.quantity.toString()}[L]${item?.price.toString()}[R]${calculatePercentDiscountPerProduct(
                                item?.price,
                                item?.quantity,
                                item?.discount,
                            )}[R]${calculateAmountAfterPercentDiscountPerProduct(
                                item?.price,
                                item?.quantity,
                                item?.discount,
                            )}\n`

                            :
                            payload += `[L]${item?.quantity.toString()}[L]${item?.price.toString()}[R]${calculateAmountDiscountPerProduct(
                                item?.quantity,
                                item?.discount,
                            )}[R]${calculateAmountAfterAmountDiscountPerProduct(
                                item?.price,
                                item?.quantity,
                                item?.discount,
                            )}\n`
                        :
                        payload += `[L]${item?.quantity.toString()}[C]${item?.price.toString()}[R]${calculateAmountAfterAmountDiscountPerProduct(
                            item?.price,
                            item?.quantity,
                            0,
                        )}\n`
                }
            }

            payload += `[C]------------------------\n` +
                `[L]ITEM: ${addedProducts?.length?.toString()}[C]QTY: ${totalQuantities.toString()}[R]AMT: ${netTotal?.toFixed(2)}\n`

            receiptSettings?.discount_flag === "Y" &&
                // @ts-ignore
                (payload += `[L]DISCOUNT[C]:[R]${parseFloat(totalDiscountAmount).toFixed(2)}\n`)

            payload += `[L]TOTAL[C]:[R]${netTotalCalculate(netTotal, totalDiscountAmount)}\n` +
                `[L]ROUND OFF[C]:[R]${roundingOffCalculate(netTotal, totalDiscountAmount)}\n` +
                `[L]NET AMT[C]:[R]${grandTotalCalculate(netTotal, totalDiscountAmount)}\n`;

            payload += `[C]------------------------\n`;

            if (receiptSettings?.rcv_cash_flag === "Y") {
                if (paymentMode === "C") {
                    payload += `[C]PAYMENT MODE\n` +
                        `[C]CASH RECEIVED: ${cashAmount}\n` +

                        `[C]RETURNED AMT: ${returnedAmt}\n` +
                        `[C]------------------------\n`;
                }
            } else {
                payload += `[C]TOTAL AMT: ${Math.abs(returnedAmt)}\n` +
                    `[C]------------------------\n`;
            }

            if (paymentMode === "R") {
                payload += `[C]PAYMENT MODE\n` +
                    `[C]CASH RECEIVED: ${cashAmount}\n` +
                    `[C]DUE AMT: ${Math.abs(returnedAmt)}\n` +
                    `[C]------------------------\n`;
            }

            if (paymentMode === "D") {
                payload += `[C]RECEIVED: ${grandTotalCalculate(
                    netTotal,
                    totalDiscountAmount,
                )} [CARD]\n` +
                    `[C]------------------------\n`;
            }

            if (paymentMode === "U") {
                payload += `[C]RECEIVED: ${grandTotalCalculate(
                    netTotal,
                    totalDiscountAmount,
                )} [UPI]\n` +
                    `[C]------------------------\n`;

                if (upiData?.length > 0) {
                    payload += `[C]<qrcode size='20'>${upiData}&am=${grandTotalCalculate(netTotal, totalDiscountAmount)}</qrcode>\n`;
                }
            }

            if (receiptSettings?.on_off_flag3 === "Y") {
                payload += `[C]${receiptSettings?.footer1}\n`;
            }
            if (receiptSettings?.on_off_flag4 === "Y") {
                payload += `[C]${receiptSettings?.footer2}\n`;
            }

            payload += `[C]----------X----------\n`;
            payload += `[C]                     \n`;
            payload += `[C]                     \n`;

            await ThermalPrinterModule.printBluetooth({
                payload: payload,
                printerNbrCharactersPerLine: 32,
                printerDpi: 120,
                printerWidthMM: 58,
                mmFeedPaper: 25,
            })
        } catch (e) {
            console.log(e.message || "ERROR")
        }
    }

    async function rePrintWithoutGst(
        addedProducts: ShowBillData[],
        netTotal: number,
        totalDiscountAmount: number,
        cashAmount?: number,
        returnedAmt?: number,
        customerName?: string,
        customerPhone?: string,
        rcptNo?: number,
        paymentMode?: string,
        isRefunded?: boolean,
        isRefundedDuplicate?: boolean,
        cancelFlag?: boolean
    ) {
        const loginStore = JSON.parse(loginStorage.getString("login-data"));
        const fileStore = fileStorage.getString("file-data");
        const upiData = fileStorage.getString("upi-data");

        const shopName = loginStore.company_name.toString();
        const cashier = loginStore.user_name.toString();

        let totalQuantities = 0;
        let payload = "";

        try {
            if (receiptSettings?.kot_flag === "Y") {
                payload +=
                    `[C]<font size='normal'>${shopName.toUpperCase()}</font>\n` +
                    `[C]------------------------\n` +
                    `[L]KOT NO.[R]--\n` +
                    `[L]TABLE NO.[R]--\n` +
                    `[L]DT.[R]${new Date().toLocaleString("en-GB")}\n` +
                    `[C]------------------------\n` +
                    `[L]ITEM[R]QTY\n`;
                for (const item of addedProducts) {
                    payload += item.item_name.length > 10
                        ? `[L]${item.item_name}\n[R]${item.qty}\n`
                        : `[L]${item.item_name}[R]${item.qty}\n`;
                }
                payload += `[C]------------------------\n`;
            }

            payload += `[C]${shopName.toUpperCase()}\n`;
            if (receiptSettings?.on_off_flag1 === "Y") payload += `[C]${receiptSettings.header1}\n`;
            if (receiptSettings?.on_off_flag2 === "Y") payload += `[C]${receiptSettings.header2}\n`;
            payload += `[L]\n`;

            if (!cancelFlag) {
                if (!isRefunded) payload += `[C]DUPLICATE RECEIPT\n`;
                else if (!isRefundedDuplicate) payload += `[C]REFUND RECEIPT\n`;
                else payload += `[C]DUPLICATE REFUND RECEIPT\n`;
            } else {
                payload += `[C]CANCELLED BILL\n`;
            }
            payload += `[L]\n`;

            payload += `[C]------------------------\n`;
            payload +=
                `[L]RCPT.NO : ${rcptNo}\n` +
                `[L]DATE    : ${new Date().toLocaleString("en-GB")}\n` +
                `[L]CASHIER : ${cashier}\n` +
                `[C]------------------------\n`;

            if (customerName || customerPhone) {
                if (receiptSettings?.cust_inf === "Y") payload += `[L]NAME : ${customerName}\n`;
                payload += `[L]PHONE: ${customerPhone}\n` +
                    `[C]------------------------\n`;
            }

            const hasDiscount = receiptSettings?.discount_flag === "Y" && receiptSettings.discount_position !== "B";
            payload += hasDiscount
                ? `[L]ITEM\n[L]QTY[L]PRC[R]DIS[R]AMT\n`
                : `[L]ITEM\n[L]QTY[C]PRC[R]AMT\n`;
            payload += `[C]------------------------\n`;

            for (const item of addedProducts) {
                // @ts-ignore
                totalQuantities += parseInt(item.qty, 10);
                payload += `[L]${item.item_name}\n`;
                if (hasDiscount) {
                    if (receiptSettings.discount_type === "P") {
                        payload +=
                            `[L]${item.qty}[L]${item.price}[R]${calculatePercentDiscountPerProduct(
                                item.price,
                                item.qty,
                                item.dis_pertg
                            )}[R]${calculateAmountAfterPercentDiscountPerProduct(
                                item.price,
                                item.qty,
                                item.dis_pertg
                            )}\n`;
                    } else {
                        payload +=
                            `[L]${item.qty}[L]${item.price}[R]${calculateAmountDiscountPerProduct(
                                item.qty,
                                item.discount_amt
                            )}[R]${calculateAmountAfterAmountDiscountPerProduct(
                                item.price,
                                item.qty,
                                item.discount_amt
                            )}\n`;
                    }
                } else {
                    payload +=
                        `[L]${item.qty}[C]${item.price}[R]${calculateAmountAfterAmountDiscountPerProduct(
                            item.price,
                            item.qty,
                            0
                        )}\n`;
                }
            }

            payload +=
                `[C]------------------------\n` +
                `[L]ITEMS: ${addedProducts.length}[C]QTY: ${totalQuantities}[R]AMT: ${netTotal.toFixed(2)}\n`;
            if (receiptSettings?.discount_flag === "Y") payload += `[L]DISCOUNT[C]:[R]${totalDiscountAmount.toFixed(2)}\n`;
            payload +=
                `[L]TOTAL[C]:[R]${netTotalCalculate(netTotal, totalDiscountAmount)}\n` +
                `[L]ROUND OFF[C]:[R]${roundingOffCalculate(netTotal, totalDiscountAmount)}\n` +
                `[L]NET AMT[C]:[R]${grandTotalCalculate(netTotal, totalDiscountAmount)}\n`;
            payload += `[C]------------------------\n`;

            if (!cancelFlag) {
                if (receiptSettings?.rcv_cash_flag === "Y" && paymentMode === "C" && !isRefunded) {
                    payload +=
                        `[C]PAYMENT MODE\n` +
                        `[C]CASH RECEIVED: ${cashAmount}\n` +
                        `[C]RETURNED AMT: ${returnedAmt}\n` +
                        `[C]------------------------\n`;
                }
                if (paymentMode === "U") {
                    payload +=
                        `[C]RECEIVED: ${grandTotalCalculate(netTotal, totalDiscountAmount)} [UPI]\n` +
                        `[C]------------------------\n`;
                    if (upiData) payload += `[C]<qrcode size='20'>${upiData}&am=${grandTotalCalculate(
                        netTotal,
                        totalDiscountAmount
                    )}</qrcode>\n`;
                }
                if (paymentMode === "D") {
                    payload +=
                        `[C]RECEIVED: ${grandTotalCalculate(netTotal, totalDiscountAmount)} [CARD]\n` +
                        `[C]------------------------\n`;
                }
                if (paymentMode === "R") {
                    payload +=
                        `[C]PAYMENT MODE\n` +
                        `[C]CASH RECEIVED: ${cashAmount}\n` +
                        `[C]DUE AMT: ${Math.abs(returnedAmt)}\n` +
                        `[C]------------------------\n`;
                }
            }

            if (isRefunded) payload += `[C]REFUNDED AMT: ${grandTotalCalculate(netTotal, totalDiscountAmount)}\n`;
            if (receiptSettings?.on_off_flag3 === "Y") payload += `[C]${receiptSettings.footer1}\n`;
            if (receiptSettings?.on_off_flag4 === "Y") payload += `[C]${receiptSettings.footer2}\n`;

            payload += `[C]------X------\n`;
            payload += `[C]             \n`;
            payload += `[C]             \n`;
            await ThermalPrinterModule.printBluetooth({
                payload,
                printerNbrCharactersPerLine: 32,
                printerDpi: 120,
                printerWidthMM: 58,
                mmFeedPaper: 25
            });
        } catch (e) {
            console.log(e.message || "ERROR");
        }
    }

    async function printReceipt() {
        return null
    }

    async function rePrint() {
        return null
    }

    return {
        printReceipt,
        printReceiptWithoutGst,
        rePrint,
        rePrintWithoutGst,
    }
}
