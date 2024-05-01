import React from "react";
import MainLayout from "../../src/components/layout/MainLayout";
import ParcelCheckout from "../../src/components/checkout/parcel";
import CssBaseline from "@mui/material/CssBaseline";
import { useRouter } from "next/router";
import AuthGuard from "../../src/components/route-guard/AuthGuard";
import ItemCheckout from "../../src/components/checkout/item-checkout";
import { useSelector } from "react-redux";
import { getCartListModuleWise } from "helper-functions/getCartListModuleWise";
import PrescriptionCheckout from "../../src/components/checkout/Prescription";
import SEO from "../../src/components/seo";
import { getServerSideProps } from "../index";
import CustomContainer from "../../src/components/container";
import RedirectWhenCartEmpty from "../../src/components/checkout/RedirectWhenCartEmpty";

const CheckOutPage = ({ configData, landingPageData }) => {
  const router = useRouter();
  const { page, store_id, id } = router.query;
  const {
    cartList: aliasCartList,
    campaignItemList,
    buyNowItemList,
    totalAmount,
  } = useSelector((state) => state.cart);
  const cartList = getCartListModuleWise(aliasCartList);

  return (
    <>
      <CssBaseline />
      <SEO
        configData={configData}
        title={configData ? `Checkout` : "Loading..."}
        image={`${configData?.base_urls?.business_logo_url}/${configData?.fav_icon}`}
        businessName={configData?.business_name}
      />

      <MainLayout configData={configData} landingPageData={landingPageData}>
        <CustomContainer>
          <AuthGuard from="checkout">
            {page === "parcel" &&
              <ParcelCheckout configData={configData} />
            }
            {page === "prescription" && (
              <PrescriptionCheckout
                storeId={store_id}
                configData={configData}
              />
            )}
            {page === "campaign" && campaignItemList.length > 0 && (
              <ItemCheckout
                router={router}
                configData={configData}
                page={page}
                cartList={cartList}
                campaignItemList={campaignItemList}
                totalAmount={totalAmount}
              />
            )}
            {page === "cart" && (
              <ItemCheckout
                router={router}
                configData={configData}
                page={page}
                cartList={cartList}
                campaignItemList={campaignItemList}
                totalAmount={totalAmount}
              />
            )}
            {page === "buy_now" && buyNowItemList.length > 0 && (
              <ItemCheckout
                router={router}
                configData={configData}
                page={page}
                cartList={buyNowItemList}
                campaignItemList={campaignItemList}
                totalAmount={totalAmount}
              />
            )}
            <RedirectWhenCartEmpty
              page={page}
              cartList={aliasCartList}
              campaignItemList={campaignItemList}
              buyNowItemList={buyNowItemList}
            />
          </AuthGuard>
        </CustomContainer>
      </MainLayout>
    </>
  );
};

export default CheckOutPage;
export { getServerSideProps };
