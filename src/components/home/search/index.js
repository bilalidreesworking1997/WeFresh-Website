import React, { useEffect, useRef, useState } from "react";
import CustomContainer from "../../container";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import TabsTypeTwo from "../../custom-tabs/TabsTypeTwo";
import SearchMenu from "../../search/SearchMenu";
import { useRouter } from "next/router";
import { useInView } from "react-intersection-observer";
import { alpha, useMediaQuery, useTheme } from "@mui/material";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { filterTypeStores } from "components/search/filterTypes";
import SideBarWithData from "components/search/SideBarWithData";
import useGetSearchPageData from "api-manage/hooks/react-query/search/useGetSearchPageData";
import MobileSideDrawer from "components/home/search/MobileSideDrawer";
import { useDispatch, useSelector } from "react-redux";
import {
  setFilterData,
  setRating_Count,
  setSelectedCategories,
} from "redux/slices/categoryIds";

const SearchResult = (props) => {
  const { searchValue, configData, isSearch, fromAllCategories, fromNav } =
    props;
  const router = useRouter();
  const dispatch = useDispatch();
  const { data_type } = router.query;
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const id = router.query.id;
  const [currentTab, setCurrentTab] = useState(0);
  const [currentView, setCurrentView] = useState(0);
  //const [filterData, setFilterData] = useState([]);
  const [offset, setOffset] = useState(0);
  const [openSideDrawer, setOpenSideDrawer] = useState(false);
  const [filterValue, setFilterValue] = useState([]);
  //const [rating_count, setRatingCount] = useState(0);
  const [minMax, setMinMax] = useState([0, 20000]);
  const [type, setType] = useState("all");
  const [category_id, setCategoryId] = useState(id);
  const [sortBy, setSortBy] = useState("high2Low");
  const [isEmpty, setIsEmpty] = useState(false);
  const { ref, inView } = useInView({
    rootMargin: "0px 0px 38% 0px",
  });
  const { selectedCategories, filterData, rating_count } = useSelector(
    (state) => state.categoryIds
  );

  useEffect(() => {
    dispatch(setSelectedCategories(data_type === "category" ? [id] : []));
  }, []);
  // useEffect(() => {
  //   dispatch(
  //     setFilterData(currentTab === 0 ? filterTypeItems : filterTypeStores)
  //   );
  // }, [filterTypeItems, filterTypeStores]);
  const page_limit = 12;
  const selectedCategoriesHandler = (dataArray) => {
    console.log({ dataArray });
    if (dataArray?.length > 0) {
      dispatch(setSelectedCategories([...new Set(dataArray)]));
    } else {
      dispatch(setSelectedCategories([]));
    }
  };
  const tabs = [
    {
      name:
        getCurrentModuleType() === "food"
          ? "Foods"
          : getCurrentModuleType() === "ecommerce"
          ? "Items"
          : getCurrentModuleType() === "pharmacy"
          ? "Medicines"
          : "Groceries",
      value: "items",
    },
    {
      name: getCurrentModuleType() === "food" ? "Restaurants" : "Stores",
      value: "stores",
    },
  ];

  const selectedCategoriesIds =
    selectedCategories?.length > 0 ? selectedCategories : id ? [id] : [];
  console.log({ filterData });
  const handleSuccess = (res) => {
    console.log({ res });
    if (res) {
      const hasData =
        currentTab === 0
          ? res?.pages[0]?.products?.length > 0
          : res?.pages[0]?.stores?.length > 0;
      if (!hasData) {
        setIsEmpty(true);
      }

      setOffset((prev) => prev + 1);
    }
  };
  const pageParams = {
    data_type,
    searchValue,
    category_id,
    selectedCategoriesIds,
    page_limit,
    offset,
    type,
    currentTab,
    filterValue,
    rating_count,
    minMax,
  };

  const {
    data: searchData,
    refetch: serachRefetch,
    isFetching: isFetchingSearchAPi,
    isRefetching: isRefetchingSearch,
    fetchNextPage: fetchNextPageSearch,
    isFetchingNextPage,
    isLoading: isLoadingSearch,
  } = useGetSearchPageData(pageParams, handleSuccess);

  const prevSelectedCategoriesIds = useRef(pageParams.selectedCategoriesIds);
  const prvMinmax = useRef(pageParams.minMax);
  const prvRating = useRef(pageParams.rating_count);

  useEffect(() => {
    handleFilterSelection();
  }, []);

  useEffect(() => {
    const hasData =
      currentTab === 0
        ? searchData?.pages[0]?.products?.length > 0
        : searchData?.pages[0]?.stores?.length > 0;
    const selectedCategoriesChanged =
      prevSelectedCategoriesIds.current !== pageParams.selectedCategoriesIds;
    prevSelectedCategoriesIds.current = pageParams.selectedCategoriesIds;
    const selectedMinMaxChanged = prvRating.current !== pageParams.minMax;
    prvMinmax.current = pageParams.minMax;

    const selectedRating = prvRating.current !== pageParams.rating_count;
    prvMinmax.current = pageParams.rating_count;
    if (
      (!hasData && selectedCategoriesChanged && isEmpty) ||
      (!hasData && selectedMinMaxChanged && isEmpty) ||
      (!hasData && selectedRating && isEmpty)
    ) {
      serachRefetch();
    }
  }, [
    searchData,
    pageParams.selectedCategoriesIds,
    serachRefetch,
    filterData,
    pageParams?.minMax,
    rating_count,
  ]);
  console.log({ isEmpty });
  const handleFilterSelection = () => {
    const filterTypesConditionally = filterTypeStores;
    const newData = filterTypesConditionally?.map((item) => {
      if (item?.value === "discounted") {
        if (data_type === "discounted") {
          return {
            ...item,
            checked: true,
          };
        } else {
          return item;
        }
      } else {
        return item;
      }
    });
    dispatch(setFilterData(newData));
  };

  const handleSortBy = (value) => {
    setSortBy(value);
    setFilterValue((prevValues) => {
      let newFilterValues = new Set([...prevValues]);
      if (value === "low") {
        if (newFilterValues?.has("high")) {
          newFilterValues?.delete("high");
        }
      } else {
        // Assuming the only other option is "high2Low"
        if (newFilterValues?.has("low")) {
          newFilterValues?.delete("low");
        }
      }
      newFilterValues.add(value);
      return [...newFilterValues];
    });
  };

  const handleCheckbox = (value, e) => {
    let newData = filterData?.map((item) =>
      item?.value === value?.value
        ? { ...item, checked: e.target.checked }
        : item
    );
    dispatch(setFilterData(newData));
  };

  useEffect(() => {
    const currentlyCheckedValues = filterData
      .filter((item) => item.checked)
      .map((item) => item.value);
    const filterValueSet = new Set(filterValue);
    const updatedFilterValue = Array.from(filterValueSet).filter((value) =>
      currentlyCheckedValues.includes(value)
    );
    currentlyCheckedValues.forEach((value) => {
      if (!filterValueSet.has(value)) {
        updatedFilterValue.push(value);
      }
    });

    setFilterValue(updatedFilterValue);
  }, [filterData]);

  const handleChangeRatings = (value) => {
    dispatch(setRating_Count(value));
  };
  const getRatingValue = () => {
    return filterData[filterData.length - 2]?.rating;
  };

  const filterDataAndFunctions = {
    filterData: filterData,
    setFilterData: setFilterData,
    handleCheckbox: handleCheckbox,
    handleChangeRatings: handleChangeRatings,
    getRatingValue: rating_count,
    currentTab: currentTab,
  };

  useEffect(() => {
    if (inView) {
      fetchNextPageSearch();
    }
  }, [
    inView,
    searchValue,
    currentTab,
    filterValue,
    selectedCategories,
    rating_count,
    minMax,
  ]);

  const handleCurrentTab = (value) => {
    setCurrentTab(value);
  };
  const getRefBox = () => (
    <CustomBoxFullWidth ref={ref} sx={{ height: "10px" }}></CustomBoxFullWidth>
  );

  const refBoxHandler = () => {
    return <>{getRefBox()}</>;
  };

  return (
    <CustomContainer>
      <CustomStackFullWidth alignItems="center" justifyContent="center">
        <CustomStackFullWidth
          alignItems="center"
          justifyContent="center"
          sx={{ marginTop: "20px", marginBottom: "20px" }}
        >
          <TabsTypeTwo
            tabs={tabs}
            currentTab={currentTab}
            setCurrentTab={handleCurrentTab}
          />
        </CustomStackFullWidth>

        <SearchMenu
          currentView={currentView}
          setCurrentView={setCurrentView}
          handleSortBy={handleSortBy}
          sortBy={sortBy}
          totalDataCount={searchData?.pages[0]?.total_size}
          currentTab={currentTab}
          tabs={tabs}
          setOpenSideDrawer={setOpenSideDrawer}
          filterDataAndFunctions={filterDataAndFunctions}
          isFetchingNextPage={isFetchingNextPage || isLoadingSearch}
          minMax={minMax}
          setMinMax={setMinMax}
        />
        <CustomBoxFullWidth
          sx={{
            borderBottom: (theme) =>
              `1px solid ${alpha(theme.palette.neutral[400], 0.4)}`,
          }}
        ></CustomBoxFullWidth>
        <CustomBoxFullWidth>
          <SideBarWithData
            searchValue={searchValue}
            id={id}
            currentTab={currentTab}
            configData={configData}
            currentView={currentView}
            filterData={filterData}
            //setFilterData={setFilterData}
            selectedCategoriesHandler={selectedCategoriesHandler}
            pageData={searchData}
            isFetchingNextPage={isFetchingNextPage || isLoadingSearch}
            fromNav={fromNav}
          />
          {refBoxHandler()}
        </CustomBoxFullWidth>
        {openSideDrawer && (
          <MobileSideDrawer
            open={openSideDrawer}
            onClose={() => setOpenSideDrawer(false)}
            sortBy={sortBy}
            handleSortBy={handleSortBy}
            searchValue={searchValue}
            id={id}
            selectedCategoriesHandler={selectedCategoriesHandler}
            currentTab={currentTab}
            handleChangeRatings={handleChangeRatings}
            //setFilterData={setFilterData}
            filterData={filterData}
            handleCheckbox={handleCheckbox}
            ratingValue={rating_count}
          />
        )}
      </CustomStackFullWidth>
    </CustomContainer>
  );
};

SearchResult.propTypes = {};

export default React.memo(SearchResult);
