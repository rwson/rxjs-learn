"use strict";

import "./style.css";

import $ from "jquery";
import Rx from "rx";

//	api地址
const API = "https://api.github.com/search/repositories?sort=stars&order=desc&q=";

//	github token
const TOKEN = "a67da1ea96604fc56408c5a683b889fbe876a982";

let container = null;

//	查询仓库
const getRepoPromise = (q) => {
    return $.ajax({
        type: "GET",
        url: `${API}${q}`
    }).promise();
};

//	通过 fromPromise 创建一个 Observable
const getRepos = (q) => {
    return Rx.Observable.fromPromise(getRepoPromise(q));
};

//	获取用户信息Promise
const getUserPromise = (data) => {
  const {url, conatiner} = data;
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "GET",
      url: `${url}?access_token=${TOKEN}`,
      success: (data) => {
        resolve({
          conatiner,
          data
        });
      },
      error: (err) => {
        console.log(err);
        reject(null);
      }
    });
  });
};

//	将ajax返回对象封装
const getUser = (data) => {
  return Rx.Observable.fromPromise(getUserPromise(data));
};

//	渲染列表
const renderList = (items) => {
    let els = [];

    //	渲染列表
    Rx.Observable.fromArray(items)

    .subscribe(
        (item) => {
        	const {owner} = item;

            els.push(`
       			<div class="repos_item">
                <div class="repos_item_wrapper">
                    <div class="repos_user_container">
                        <div class="user_header_container" data-id="${item.id}" data-api="${owner.url}">
                            <img class="user_header" src="${owner.avatar_url}" />
                        </div>
                        <div class="user_info">
                            <a class="user_link" target="_blank" href="${owner.html_url}">
                  				${owner.login}
                			</a> /
                            <a class="repos_link" target="_blank" href="${item.html_url}">
                  				${item.name}
                			</a>
                        </div>
                    </div>
                    <div class="repos_info_container">
                        <div class="repos_desc">
                            ${item.description}
                        </div>
                        <div class="repos_info">
                            <em class="repos_language">${item.language || ''}</em>
                            <i aria-hidden="true" class="fa fa-star"></i>&nbsp;${item.stargazers_count}&nbsp;&nbsp;
                            <i aria-hidden="true" class="fa fa-eye"></i>&nbsp;${item.watchers_count}&nbsp;&nbsp;
                            <i aria-hidden="true" class="fa fa-code-fork"></i>&nbsp;${item.watchers_count}&nbsp;&nbsp;
                            <i aria-hidden="true" class="fa fa-file-archive-o"></i>&nbsp;670
                        </div>
                    </div>
                </div>
            </div>
			`);
        },
        (ex) => {
            console.log(ex);
        },
        () => {
            container.html(els.join(""));
            console.log("render complete");
        }
    );
};

//	渲染用户信息
const renderInfo = (items) => {

	//	监听mouseover事件
	Rx.Observable.fromEvent($(".user_header"), "mouseover")
		
		//	500毫秒
		.debounce(500)

		//	取没有请求过的
		.takeWhile((e) => {
			console.log(e);
			return $(e.target).parent().find(".infos_container").length === 0;
		})

		.map((e) => {
			const {target} = e,
				  $target = $(target),
				  $parent = $target.parent();
			return {
				infoContainer: $parent.find(".user_infos_wrapper"),
				url: $parent.attr("data-api")
			};
		})

		.filter((data) => !!data.url)

		.flatMapLatest(getUser)

	   	.do((result) => {
			const {data, infoContainer} = result;
			infoContainer.html(userInfoTemplate(data));
	    });
};



$(() => {

    container = $("div.content_container");

    const $input = $("input.search"),

        //	通过 input 的 keyup 事件来创建流
        obversable = Rx.Observable.fromEvent($input, "keyup")

    //	事件节流
    .debounce(400)

    //	获取每次 keyup 时搜索框的值，筛选出合法值
    .map(() => $input.val().trim())

    //	选出非空值
    .filter((val) => !!val)

    //	只取不一样的值
    .distinctUntilChanged()

    .do(() => container.html(""))

    //	仅处理最后一次的异步(可能不同的异步请求响应时间不同,所以取得最后一个异步响应)
    .flatMapLatest(getRepos);

    //	订阅事件
    obversable.subscribe(

        //	next
        (res) => {

            if (res.items.length) {
                renderList(res.items);
            }
        },

        //	error
        (ex) => {
            console.log(ex);
        },

        //	complete
        () => {
            console.log("complete");
        }
    );

});

