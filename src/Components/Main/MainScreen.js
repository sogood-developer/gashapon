

import { useEffect, useState } from "react";

import liff from "@line/liff";
import { CURRENT_ENV } from "../../Utills/constants";
import axios from "axios";
import LoadingScreen from "../Loading/LoadingScreen";
import game from "../../Images/game.png";

function MainScreen() {
  const [profileLine, setProfileLine] = useState();
  const [data, setData] = useState(null);
  const [listRewards, setListRewards] = useState(null);
  const [rewards, setRewards] = useState(null);

  const [isShaking, setIsShaking] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    liff
      .init({
        liffId: CURRENT_ENV.LIFF_ID,
      })
      .then(async () => {
        if (liff.isLoggedIn()) {
          liff
            .getProfile()
            .then((profile) => {
              console.log("%cPROFILE LINEOA : ", "color: green", profile);
              setProfileLine(profile.userId);
            })
            .catch((err) => {
              console.log("%cERROR LINEOA DETAIL", "color: red", err);
            });
        } else {
          liff.login();
        }
      })
      .catch((err) => {
        console.log(
          "%cERROR LINEOA HEADER",
          "color: red",
          err.code,
          err.message
        );
      });
    return () => { };
  }, []);

  useEffect(() => {
    const fetchData = async () => {

      if (profileLine) {
        try {
          const response = await axios.get(`${CURRENT_ENV.API_BASE_URL}?path=getData&userId=${profileLine}`);
          if (response.data.status === 200) {
            setData(response.data.data)
          }
        } catch (_) { }
        finally {
          setLoading(false)
        }
      }
    };
    fetchData();

  }, [profileLine]);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const response = await axios.get(`${CURRENT_ENV.API_BASE_URL}?path=getRewards`);
        if (response.data.status === 200) {
          setListRewards(response.data.data)
        }
      } catch (_) { }
      finally {
        // setLoading(false)
      }
    };
    fetchRewards();

  }, []);

  const randomRewards = async () => {
    try {
      setIsShaking(true);
      setLoading(true)
      setRewards(null)
      const response = await axios.get(`${CURRENT_ENV.API_BASE_URL}?path=play&userId=${profileLine}`);
      if (response.data.status === 200) {
        setRewards(response.data)
        liff
          .sendMessages([
            {
              "type": "flex",
              "altText": `ยินดีด้วยคุณได้รับรางวัล คลิกเพื่อดู`,
              "contents": {
                "type": "bubble",
                "hero": {
                  "type": "image",
                  "url": "https://i.postimg.cc/Kc62CfJT/happynewyear.webp",
                  "size": "full",
                  "aspectRatio": "20:13",
                  "aspectMode": "cover"
                },
                "body": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Happy new year 2025!",
                      "weight": "bold",
                      "size": "xl"
                    },
                    {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": `ยินดีด้วยคุณได้รับ ${response.data.reward.name}`,
                          "size": "lg",
                          "color": "#B3B3B3",
                          "wrap": true
                        }
                      ]
                    }
                  ]
                }
              }
            }
          ])
          .then(() => {
            window.alert("ส่งรางวัลไปยังช่องแชทเรียบร้อยค่ะ")
          })
          .catch((err) => {
            console.log("error", err);
          });
      } else if (response.data.status === 204) {
        window.alert(response.data.message)
      }
    } catch (_) { }
    finally {
      setIsShaking(false)
      setLoading(false)
    }
  };

  return (
    <>
      {
        loading ?
          <LoadingScreen />
          : null

      }
      <div>
        <div className="container app-bg">
          <div>
            <div>
              <h1 className="txt-title">สุ่มกาชาปอง ลุ้นรางวัลใหญ่</h1>
            </div>
            <div>
              {
                data?.value >= data?.total || rewards?.data?.value >= rewards?.data?.total ?
                  <img src={game} alt="" className="reward-image" style={{ opacity: 0.5 }} />
                  :
                  <img onClick={() => { randomRewards() }} src={game} alt="" className={`reward-image ${isShaking ? "shake" : ""}`} />
              }

            </div>
            {
              rewards ?
                <div>
                  <div style={{ display: `flex`, flexDirection: `row`, backgroundColor: `#ffffff94`, borderRadius: 20, justifyContent: `center`, alignContent: `center`, overflow: `scroll`, padding: 10, fontSize: 20, fontWeight: `bold`, border: `3px solid #9bff15` }}>
                    คุณได้รับ : {rewards?.reward?.name}
                  </div>
                </div>
                : null
            }

            {
              data?.value >= data?.total ?
                <div>
                  <div style={{ display: `flex`, flexDirection: `row`, backgroundColor: `#ffffff94`, borderRadius: 20, justifyContent: `center`, alignContent: `center`, overflow: `scroll`, padding: 10, fontSize: 20, fontWeight: `bold`, border: `3px solid red` }}>
                    ขออภัย คุณใช้สิทธิ์สุ่มรางวัลครบแล้ว!
                  </div>
                </div>
                : null
            }

            {
              listRewards ?
                <div>
                  <h2 className="txt-title">ของรางวัล</h2>
                  <div>
                    <div style={{ display: `flex`, flexDirection: `row`, justifyContent: `center`, alignContent: `center` }}>
                      <div style={{ display: `flex`, flexDirection: `row`, backgroundColor: `#ffffff94`, borderRadius: 20, justifyContent: `center`, alignContent: `center`, overflow: `scroll`, padding: `0px 10px` }}>
                        {
                          listRewards?.map((data, index) => (
                            <div key={index}>
                              <div style={{ display: `flex`, justifyContent: `center`, alignItems: `center`, flexDirection: `column`, margin: 10 }}>
                                <img src={data.image} alt="" style={{ width: 60 }} />
                                {data.name}
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                </div> : null
            }
          </div>
        </div>
      </div>
    </>
  );
}

export default MainScreen;
